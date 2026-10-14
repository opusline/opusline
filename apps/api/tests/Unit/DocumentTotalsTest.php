<?php

declare(strict_types=1);

use App\Domain\Invoices\Documents\DocumentTotals;
use App\Domain\Invoices\Documents\PaymentTerm;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;

function line(int $quantityMilli, int $unitPriceCents, int $vatRateBp = 2000): array
{
    return ['quantityMilli' => $quantityMilli, 'unitPrice' => new Money($unitPriceCents, 'EUR'), 'vatRateBp' => $vatRateBp];
}

test('rounds each line to the cent, half up', function (): void {
    // 1,5 h × 85,33 € = 127,995 € → 128,00 €
    expect(DocumentTotals::lineTotal(1500, new Money(8533, 'EUR'))->getAmount())->toBe('12800');
    // 0,333 j × 100,00 € = 33,30 €
    expect(DocumentTotals::lineTotal(333, new Money(10000, 'EUR'))->getAmount())->toBe('3330');
});

test('rounds a deduction away from zero, like its positive twin', function (): void {
    expect(DocumentTotals::lineTotal(1500, new Money(-8533, 'EUR'))->getAmount())->toBe('-12800');
});

test('computes the VAT once per rate, on the sum of that rate\'s lines', function (): void {
    // Three lines of 0,05 € at 20 %: per line the VAT would round to 0,01 € three
    // times (0,03 €); on the 0,15 € base it is 0,03 € — the same here, but a base
    // of 0,25 € (five lines) gives 0,05 €, not 5 × 0,01 €.
    $totals = DocumentTotals::of([line(1000, 5), line(1000, 5), line(1000, 5), line(1000, 5), line(1000, 5)], 'EUR');

    expect($totals->ht->getAmount())->toBe('25')
        ->and($totals->vat->getAmount())->toBe('5')
        ->and($totals->ttc->getAmount())->toBe('30');
});

test('prints one breakdown row per rate, highest first', function (): void {
    $totals = DocumentTotals::of([
        line(1000, 10000, 550),
        line(2000, 48000, 2000),
        line(1000, 5000, 550),
    ], 'EUR');

    expect(array_map(fn (array $row): array => [$row['rateBp'], $row['base']->getAmount(), $row['vat']->getAmount()], $totals->vatBreakdown))
        ->toBe([[2000, '96000', '19200'], [550, '15000', '825']])
        ->and($totals->ht->getAmount())->toBe('111000')
        ->and($totals->vat->getAmount())->toBe('20025')
        ->and($totals->ttc->getAmount())->toBe('131025')
        ->and($totals->dominantRateBp(0))->toBe(2000);
});

test('lets a deduction line reduce its rate\'s base', function (): void {
    $totals = DocumentTotals::of([line(1000, 240000), line(1000, -50000)], 'EUR');

    expect($totals->ht->getAmount())->toBe('190000')
        ->and($totals->vat->getAmount())->toBe('38000');
});

test('totals an empty document to zero and falls back on the default rate', function (): void {
    $totals = DocumentTotals::of([], 'EUR');

    expect($totals->ttc->getAmount())->toBe('0')
        ->and($totals->vatBreakdown)->toBe([])
        ->and($totals->dominantRateBp(2000))->toBe(2000);
});

test('counts a payment term from the issue date or from the end of its month', function (int $days, bool $endOfMonth, string $due): void {
    expect(new PaymentTerm($days, $endOfMonth)->dueOn(CarbonImmutable::parse('2026-08-10'))->toDateString())->toBe($due);
})->with([
    'on receipt' => [0, false, '2026-08-10'],
    '30 days net' => [30, false, '2026-09-09'],
    'end of month' => [0, true, '2026-08-31'],
    '45 days end of month' => [45, true, '2026-10-15'],
]);
