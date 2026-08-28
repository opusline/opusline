<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Revenue;

use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Illuminate\Support\Collection;
use Money\Money as MoneyPhp;

/**
 * The invoices an account collected over a span, loaded once and reduced up
 * front to the three numbers any caller asks for.
 *
 * The treasury provisions and the fiscal deadlines ask the same two questions
 * of overlapping windows — how much TVA the paid invoices carried, how much HT
 * they collected — so the arithmetic that answers them lives here rather than
 * once per caller. Cash basis throughout: micro-régime TVA and URSSAF are both
 * due on what was actually paid, never on what was invoiced.
 *
 * Flattened to scalars in the constructor rather than kept as models, because
 * the deadlines screen asks about ~30 windows in one request: re-deriving a
 * date string and a Money per invoice per window is what would make that
 * quadratic.
 *
 * @phpstan-type CollectedRow array{date: string, ht: int, vat: int}
 */
final readonly class CollectedInvoices
{
    private const int BASIS_POINTS = 10_000;

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
        if ($from->greaterThan($to)) {
            return self::none();
        }

        $invoices = $user->invoices()
            ->where('status', InvoiceStatus::Paid)
            ->whereBetween('paid_on', [$from->toDateString(), $to->toDateString()])
            ->get(['paid_on', 'amount_ht_cents', 'amount_ttc_cents', 'currency']);

        return new self(self::rows($invoices));
    }

    /**
     * The TVA the invoices paid in the window actually carried — per-invoice
     * actuals, not one rate applied to the total.
     */
    public function vatCents(CarbonImmutable $from, CarbonImmutable $to): int
    {
        return $this->sumBetween($from, $to, 'vat');
    }

    /**
     * What the HT collected in the window owes in contributions at $rateBp.
     */
    public function contributionsCents(
        CarbonImmutable $from,
        CarbonImmutable $to,
        int $rateBp,
        string $currency,
    ): int {
        return (int) new Money($this->sumBetween($from, $to, 'ht'), $currency)
            ->multiply($rateBp)
            ->divide(self::BASIS_POINTS, MoneyPhp::ROUND_HALF_UP)
            ->getAmount();
    }

    /**
     * @param  Collection<int, Invoice>  $invoices
     * @return list<CollectedRow>
     */
    private static function rows(Collection $invoices): array
    {
        $rows = [];

        foreach ($invoices as $invoice) {
            // The query cannot return a null paid_on; this narrows it for the
            // type system rather than guessing a date for one.
            if ($invoice->paid_on === null) {
                continue;
            }

            $rows[] = [
                'date' => $invoice->paid_on->toDateString(),
                'ht' => (int) $invoice->amount_ht_cents->getAmount(),
                'vat' => (int) $invoice->vatAmount()->getAmount(),
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
        $fromDate = $from->toDateString();
        $toDate = $to->toDateString();
        $total = 0;

        foreach ($this->collected as $row) {
            if ($row['date'] >= $fromDate && $row['date'] <= $toDate) {
                $total += $row[$component];
            }
        }

        return $total;
    }
}
