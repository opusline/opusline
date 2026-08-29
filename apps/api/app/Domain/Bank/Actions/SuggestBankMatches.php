<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Enums\BankMatchReason;
use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * Pairs freshly imported credit movements with the Sent invoices they appear
 * to settle. Deterministic and conservative: only exact TTC amounts, one
 * suggestion per movement, each invoice claimed at most once, and no
 * suggestion at all when the evidence is ambiguous — a wrong "Valider" writes
 * a paid_on into a declaration period.
 */
class SuggestBankMatches
{
    /**
     * @param  list<BankMovement>  $movements  suggestible rows of $user: credits, unlinked, no match row
     * @return int suggestions created
     */
    public function handle(User $user, array $movements): int
    {
        $candidates = $this->candidateInvoices($user);

        if ($candidates->isEmpty()) {
            return 0;
        }

        $candidateIdsByAmount = $this->candidateIdsByAmount($candidates);
        $sentCountsByAmount = $this->sentCountsByAmount($user);
        $today = $user->settingsOrFail()->today();

        $ordered = collect($movements)
            ->filter(fn (BankMovement $movement): bool => $movement->isCredit() && $movement->invoice_id === null)
            ->sortBy([['booked_on', 'asc'], ['id', 'asc']]);

        $now = now();
        $rows = [];

        foreach ($ordered as $movement) {
            $match = $this->bestCandidate($movement, $candidates, $candidateIdsByAmount, $sentCountsByAmount, $today);

            if ($match === null) {
                continue;
            }

            [$invoice, $reason] = $match;

            $rows[] = [
                'user_id' => $user->id,
                'bank_movement_id' => $movement->id,
                'invoice_id' => $invoice->id,
                'status' => BankMatchStatus::Pending->value,
                'reason' => $reason->value,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $candidates->forget($invoice->id);
        }

        // Bulk-inserted: this runs inside the import's user row lock, and a
        // re-import over years of history can raise hundreds of suggestions.
        foreach (array_chunk($rows, ImportBankStatement::INSERT_CHUNK) as $chunk) {
            $user->bankMatches()->insert($chunk);
        }

        return count($rows);
    }

    /**
     * Candidate invoice ids bucketed by TTC cents. The exact amount is the
     * first gate every pairing must pass, so only the same-amount bucket is
     * ever worth scoring — O(movements + invoices) instead of a full cross
     * product. Ids claimed later are forgotten from $candidates, not from
     * these buckets; bestCandidate() skips them on lookup.
     *
     * @param  Collection<int, array{invoice: Invoice, invoiceNeedle: ?string, clientNeedle: ?string}>  $candidates
     * @return array<int, list<int>>
     */
    private function candidateIdsByAmount(Collection $candidates): array
    {
        $idsByAmount = [];

        foreach ($candidates as $invoiceId => $candidate) {
            $idsByAmount[(int) $candidate['invoice']->amount_ttc_cents->getAmount()][] = $invoiceId;
        }

        return $idsByAmount;
    }

    /**
     * Sent invoices not already spoken for by a pending or validated match,
     * with their search needles computed once — not per movement pair.
     * Dismissed pairs stay dismissed, but the invoice may match another
     * movement.
     *
     * @return Collection<int, array{invoice: Invoice, invoiceNeedle: ?string, clientNeedle: ?string}> keyed by invoice id
     */
    private function candidateInvoices(User $user): Collection
    {
        $claimed = $user->bankMatches()
            ->whereIn('status', [BankMatchStatus::Pending, BankMatchStatus::Validated])
            ->pluck('invoice_id');

        return $user->invoices()
            ->where('status', InvoiceStatus::Sent)
            ->whereNotIn('id', $claimed)
            ->with('client')
            ->get()
            ->keyBy('id')
            ->map(static fn (Invoice $invoice): array => [
                'invoice' => $invoice,
                'invoiceNeedle' => NormalizeBankText::invoiceNeedle($invoice->number),
                'clientNeedle' => NormalizeBankText::clientNeedle($invoice->client->name),
            ]);
    }

    /**
     * How many Sent invoices share each TTC amount — the uniqueness test behind
     * the overdue reason, counted across all Sent invoices, claimed or not.
     *
     * @return array<int, int>
     */
    private function sentCountsByAmount(User $user): array
    {
        /** @var array<int, int> */
        return $user->invoices()
            ->where('status', InvoiceStatus::Sent)
            ->selectRaw('amount_ttc_cents, count(*) as occurrences')
            ->groupBy('amount_ttc_cents')
            ->pluck('occurrences', 'amount_ttc_cents')
            ->all();
    }

    /**
     * @param  Collection<int, array{invoice: Invoice, invoiceNeedle: ?string, clientNeedle: ?string}>  $candidates
     * @param  array<int, list<int>>  $candidateIdsByAmount
     * @param  array<int, int>  $sentCountsByAmount
     * @return ?array{0: Invoice, 1: BankMatchReason}
     */
    private function bestCandidate(
        BankMovement $movement,
        Collection $candidates,
        array $candidateIdsByAmount,
        array $sentCountsByAmount,
        CarbonImmutable $today,
    ): ?array {
        $movementCents = (int) $movement->amount_cents->getAmount();
        $label = NormalizeBankText::normalize($movement->label);

        $best = null;

        foreach ($candidateIdsByAmount[$movementCents] ?? [] as $invoiceId) {
            $candidate = $candidates->get($invoiceId);

            if ($candidate === null) {
                continue;
            }

            $invoice = $candidate['invoice'];

            if ($invoice->currency !== $movement->currency) {
                continue;
            }

            $reason = $this->reasonFor($candidate, $label, $sentCountsByAmount, $today);

            if (! $reason instanceof BankMatchReason) {
                continue;
            }

            if ($best === null || $this->beats($invoice, $reason, $best[0], $best[1])) {
                $best = [$invoice, $reason];
            }
        }

        return $best;
    }

    /**
     * @param  array{invoice: Invoice, invoiceNeedle: ?string, clientNeedle: ?string}  $candidate
     * @param  array<int, int>  $sentCountsByAmount
     */
    private function reasonFor(
        array $candidate,
        string $normalizedLabel,
        array $sentCountsByAmount,
        CarbonImmutable $today,
    ): ?BankMatchReason {
        $invoice = $candidate['invoice'];

        if ($candidate['invoiceNeedle'] !== null && str_contains($normalizedLabel, $candidate['invoiceNeedle'])) {
            return BankMatchReason::RefInLabel;
        }

        if ($candidate['clientNeedle'] !== null && str_contains($normalizedLabel, $candidate['clientNeedle'])) {
            return BankMatchReason::ClientInLabel;
        }

        $isOverdue = $invoice->due_on->lessThan($today);
        $amountIsUnique = ($sentCountsByAmount[(int) $invoice->amount_ttc_cents->getAmount()] ?? 0) === 1;

        if ($isOverdue && $amountIsUnique) {
            return BankMatchReason::OverdueUniqueAmount;
        }

        return null;
    }

    private function beats(Invoice $invoice, BankMatchReason $reason, Invoice $best, BankMatchReason $bestReason): bool
    {
        if ($reason->value !== $bestReason->value) {
            return $reason->value < $bestReason->value;
        }

        if (! $invoice->due_on->equalTo($best->due_on)) {
            return $invoice->due_on->lessThan($best->due_on);
        }

        return $invoice->id < $best->id;
    }
}
