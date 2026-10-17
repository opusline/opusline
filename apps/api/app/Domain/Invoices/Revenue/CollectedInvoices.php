<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Revenue;

use App\Domain\Invoices\Models\InvoicePayment;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * What an account collected over a span, loaded once and reduced up front to
 * the few numbers any caller asks for.
 *
 * The treasury provisions and the fiscal deadlines ask the same two questions
 * of overlapping windows — how much TVA the payments carried, how much HT
 * they collected — so the arithmetic that answers them lives here rather than
 * once per caller. Cash basis throughout: micro-régime TVA and URSSAF are both
 * due on what was actually paid, never on what was invoiced. A payment is the
 * unit: an invoice paid in two transfers is collected twice, each on its own
 * day, each carrying its share of the invoice's HT and VAT.
 *
 * Flattened to scalars in the constructor rather than kept as models, because
 * the deadlines screen asks about ~30 windows in one request: re-deriving a
 * date string and a Money per payment per window is what would make that
 * quadratic.
 *
 * @phpstan-type CollectedRow array{date: string, invoiceId: int, ht: int, vat: int, rateBp: int}
 */
final readonly class CollectedInvoices
{
    /**
     * @param  list<CollectedRow>  $collected
     */
    private function __construct(private array $collected) {}

    /** For an account whose régime asks nothing of its collections. */
    public static function none(): self
    {
        return new self([]);
    }

    public static function paidBetween(User $user, CarbonImmutable $from, CarbonImmutable $to): self
    {
        return self::paidBetweenForUser($user->id, $from, $to);
    }

    public static function paidBetweenForUser(int $userId, CarbonImmutable $from, CarbonImmutable $to): self
    {
        if ($from->greaterThan($to)) {
            return self::none();
        }

        $payments = InvoicePayment::query()
            ->where('user_id', $userId)
            ->whereBetween('paid_on', [$from->toDateString(), $to->toDateString()])
            ->with(['invoice:id,amount_ht_cents,amount_ttc_cents,vat_rate_bp,currency', 'creditNote:id,amount_ht_cents,amount_ttc_cents,currency'])
            ->get(['id', 'invoice_id', 'credit_note_id', 'amount_cents', 'currency', 'paid_on']);

        return new self(self::rows($payments));
    }

    /**
     * The TVA the payments in the window actually carried — each payment's
     * share of its invoice's TVA, not one rate applied to the total.
     */
    public function vatCents(CarbonImmutable $from, CarbonImmutable $to): int
    {
        return $this->sumBetween($from, $to, 'vat');
    }

    /** How many invoices received money in the window — the caption under the figure. */
    public function countBetween(CarbonImmutable $from, CarbonImmutable $to): int
    {
        return count(array_unique(array_column($this->rowsBetween($from, $to), 'invoiceId')));
    }

    /** The HT actually collected in the window — the URSSAF declaration's base. */
    public function htCents(CarbonImmutable $from, CarbonImmutable $to): int
    {
        return $this->sumBetween($from, $to, 'ht');
    }

    /**
     * The one VAT rate every payment collected in the window carries — caption
     * context, not an input to any sum.
     */
    public function uniqueRateBp(CarbonImmutable $from, CarbonImmutable $to, int $default): ?int
    {
        return self::consensusRateBp(array_column($this->rowsBetween($from, $to), 'rateBp'), $default);
    }

    /**
     * The single rate a set of invoices can be captioned with.
     *
     * A set with nothing in it reads as the account's own rate rather than as
     * "several rates", which is what an empty unique() would otherwise caption;
     * disagreement returns null, because no one figure describes a mixed set
     * honestly. Shared so the invoiced and collected bases cannot drift — the
     * Revenus screen reduces Eloquent models, this class reduces flat rows.
     *
     * @param  iterable<int>  $rateBps
     */
    public static function consensusRateBp(iterable $rateBps, int $default): ?int
    {
        $distinct = [];

        foreach ($rateBps as $rateBp) {
            $distinct[$rateBp] = true;
        }

        return match (count($distinct)) {
            0 => $default,
            1 => array_key_first($distinct),
            default => null,
        };
    }

    /**
     * @param  Collection<int, InvoicePayment>  $payments
     * @return list<CollectedRow>
     */
    private static function rows(Collection $payments): array
    {
        $rows = [];

        foreach ($payments as $payment) {
            $rows[] = [
                'date' => $payment->paid_on->toDateString(),
                'invoiceId' => $payment->invoice_id,
                'ht' => (int) $payment->htShare()->getAmount(),
                'vat' => (int) $payment->vatShare()->getAmount(),
                'rateBp' => $payment->invoice->vat_rate_bp,
            ];
        }

        return $rows;
    }

    /**
     * Date-string bounds so the bucketing matches what a whereBetween on the
     * date column would have returned.
     *
     * @param  'ht'|'vat'  $component
     */
    private function sumBetween(CarbonImmutable $from, CarbonImmutable $to, string $component): int
    {
        return array_sum(array_column($this->rowsBetween($from, $to), $component));
    }

    /**
     * @return list<CollectedRow>
     */
    private function rowsBetween(CarbonImmutable $from, CarbonImmutable $to): array
    {
        $fromDate = $from->toDateString();
        $toDate = $to->toDateString();

        return array_values(array_filter(
            $this->collected,
            static fn (array $row): bool => $row['date'] >= $fromDate && $row['date'] <= $toDate,
        ));
    }
}
