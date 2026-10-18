<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Documents;

use App\Domain\Shared\Money\Rate;
use Cknow\Money\Money;
use Money\Money as MoneyPhp;

/**
 * The totals of a document computed from its lines, in integer cents.
 *
 * Each line is rounded to the cent on its own (quantity × unit price), the way
 * the line prints. The VAT is then computed once per rate on the sum of the
 * lines carrying it — the per-rate table every French invoice prints — and
 * rounded half up there, so the printed breakdown, the total and the stored
 * header amounts can never disagree by a cent.
 */
final readonly class DocumentTotals
{
    /**
     * @param  list<Money>  $lineTotals  Each line's total before tax, in input order.
     * @param  list<array{rateBp: int, base: Money, vat: Money}>  $vatBreakdown  One row per rate, highest first.
     */
    private function __construct(
        public array $lineTotals,
        public Money $ht,
        public array $vatBreakdown,
        public Money $vat,
        public Money $ttc,
    ) {}

    /**
     * @param  list<array{quantityMilli: int, unitPrice: Money, vatRateBp: int}>  $lines
     */
    public static function of(array $lines, string $currency): self
    {
        $zero = new Money(0, $currency);
        $lineTotals = [];
        $bases = [];

        foreach ($lines as $line) {
            $total = self::lineTotal($line['quantityMilli'], $line['unitPrice']);
            $lineTotals[] = $total;
            $bases[$line['vatRateBp']] = ($bases[$line['vatRateBp']] ?? $zero)->add($total);
        }

        krsort($bases);
        $breakdown = [];
        $vat = $zero;

        foreach ($bases as $rateBp => $base) {
            $rateVat = Rate::of($base, $rateBp);
            $breakdown[] = ['rateBp' => $rateBp, 'base' => $base, 'vat' => $rateVat];
            $vat = $vat->add($rateVat);
        }

        $ht = array_reduce($lineTotals, static fn (Money $sum, Money $total): Money => $sum->add($total), $zero);

        return new self($lineTotals, $ht, $breakdown, $vat, $ht->add($vat));
    }

    /** Quantity in thousandths times the unit price, half up to the cent (half away from zero for a deduction). */
    public static function lineTotal(int $quantityMilli, Money $unitPrice): Money
    {
        return $unitPrice->multiply($quantityMilli)->divide(1000, MoneyPhp::ROUND_HALF_UP);
    }

    /**
     * The rate that carries most of the base: what the invoice header records,
     * where only a caption reads it. No sum ever comes from it.
     */
    /** A draft may hold a discount line, but never take the document below zero. */
    public function isNegative(): bool
    {
        return $this->ht->isNegative() || $this->ttc->isNegative();
    }

    public function dominantRateBp(int $default): int
    {
        $dominant = null;

        foreach ($this->vatBreakdown as $row) {
            if ($dominant === null || $row['base']->absolute()->greaterThan($dominant['base']->absolute())) {
                $dominant = $row;
            }
        }

        return $dominant['rateBp'] ?? $default;
    }
}
