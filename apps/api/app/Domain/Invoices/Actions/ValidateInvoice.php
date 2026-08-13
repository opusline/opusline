<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\CreateInvoiceData;
use App\Domain\Invoices\Data\UpdateInvoiceData;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Validation\ValidationException;

/**
 * Cross-field rules that no single validation attribute can express.
 *
 * Create and update are separate entry points rather than one union-typed method:
 * an update always has a stored invoice to compare against, and pretending it might
 * not led to a fallback that could only ever be wrong.
 */
class ValidateInvoice
{
    public function forCreate(User $user, CreateInvoiceData $data, CarbonImmutable $issuedOn): void
    {
        $status = $data->status ?? InvoiceStatus::Draft;

        $this->assertMissionBelongsToClient($user, $data->clientId, $data->missionId);
        $this->assertAmountsAgree($data->amountHt, $data->amountTtc);
        $this->assertDatesAgree($issuedOn, $data->dueOn, $data->periodStart, $data->periodEnd);
        $this->assertPaymentMatchesStatus($status, $data->paidOn, $issuedOn);
        $this->assertNumberPresentOnceIssued($status, $data->number);
    }

    public function forUpdate(User $user, UpdateInvoiceData $data, Invoice $current, CarbonImmutable $issuedOn): void
    {
        $this->assertMissionBelongsToClient($user, $data->clientId, $data->missionId);
        $this->assertAmountsAgree($data->amountHt, $data->amountTtc);
        $this->assertDatesAgree($issuedOn, $data->dueOn, $data->periodStart, $data->periodEnd);
        $this->assertPaymentMatchesStatus($current->status, $data->paidOn, $issuedOn);
        $this->assertNumberIsFree($user, $data->number, $current);
        $this->assertLinkedTimeEntriesStay($data, $current);
        $this->assertNumberPresentOnceIssued($current->status, $data->number);
    }

    /**
     * An invoice that exists outside Opusline carries the reference its issuer printed
     * on it. Only a draft is allowed to have none yet.
     */
    private function assertNumberPresentOnceIssued(InvoiceStatus $status, ?string $number): void
    {
        if ($status->isIssued() && $number === null) {
            throw ValidationException::withMessages([
                'number' => __('invoices.number_required_once_issued'),
            ]);
        }
    }

    private function assertMissionBelongsToClient(User $user, int $clientId, ?int $missionId): void
    {
        if ($missionId === null) {
            return;
        }

        $missionClientId = $user->missions()->whereKey($missionId)->value('client_id');

        if ($missionClientId !== $clientId) {
            throw ValidationException::withMessages([
                'missionId' => __('invoices.mission_client_mismatch'),
            ]);
        }
    }

    private function assertAmountsAgree(MoneyData $amountHt, ?MoneyData $amountTtc): void
    {
        if (! $amountTtc instanceof MoneyData) {
            return;
        }

        if ($amountTtc->amount < $amountHt->amount) {
            throw ValidationException::withMessages([
                'amountTtc' => __('invoices.ttc_below_ht'),
            ]);
        }
    }

    /**
     * Takes the issue date the caller is about to store, not the raw input: on an
     * update an omitted issuedOn keeps the stored one, and re-deriving it here as
     * "today" would reject every correction to a past invoice.
     */
    private function assertDatesAgree(CarbonImmutable $issuedOn, ?string $dueOn, ?string $periodStart, ?string $periodEnd): void
    {
        if ($dueOn !== null && CarbonImmutable::parse($dueOn)->isBefore($issuedOn)) {
            throw ValidationException::withMessages([
                'dueOn' => __('invoices.due_before_issued'),
            ]);
        }

        if ($periodStart !== null && $periodEnd !== null
            && CarbonImmutable::parse($periodEnd)->isBefore(CarbonImmutable::parse($periodStart))) {
            throw ValidationException::withMessages([
                'periodEnd' => __('invoices.period_end_before_start'),
            ]);
        }
    }

    /**
     * A payment date is exactly as load-bearing as the Paid status: cash-basis
     * declarations read one through the other, so neither is allowed without the other.
     */
    private function assertPaymentMatchesStatus(InvoiceStatus $status, ?string $paidOn, CarbonImmutable $issuedOn): void
    {
        if ($status === InvoiceStatus::Paid && $paidOn === null) {
            throw ValidationException::withMessages([
                'paidOn' => __('invoices.paid_on_required'),
            ]);
        }

        if ($paidOn === null) {
            return;
        }

        if ($status !== InvoiceStatus::Paid) {
            throw ValidationException::withMessages([
                'paidOn' => __('invoices.paid_on_without_payment'),
            ]);
        }

        if (CarbonImmutable::parse($paidOn)->isBefore($issuedOn)) {
            throw ValidationException::withMessages([
                'paidOn' => __('invoices.paid_on_before_issued'),
            ]);
        }
    }

    /**
     * CreateInvoiceData carries #[Unique]; an update cannot, because the rule would
     * have to ignore the invoice's own row and the id is not available to a static
     * attribute.
     */
    private function assertNumberIsFree(User $user, ?string $number, Invoice $current): void
    {
        if ($number === null) {
            return;
        }

        $taken = $user->invoices()
            ->where('number', $number)
            ->whereKeyNot($current->getKey())
            ->exists();

        if ($taken) {
            throw ValidationException::withMessages([
                'number' => __('invoices.number_taken'),
            ]);
        }
    }

    /**
     * Moving an invoice to another client or mission would strand the time entries it
     * bills. Refuse rather than silently unlink them.
     */
    private function assertLinkedTimeEntriesStay(UpdateInvoiceData $data, Invoice $current): void
    {
        $moves = $data->clientId !== $current->client_id || $data->missionId !== $current->mission_id;

        if (! $moves || ! $current->timeEntries()->exists()) {
            return;
        }

        throw ValidationException::withMessages([
            'missionId' => __('invoices.cannot_move_with_linked_time_entries'),
        ]);
    }
}
