<?php

declare(strict_types=1);

use App\Domain\Invoices\Actions\ComputeInvoiceAmounts;
use Cknow\Money\Money;

test('computes TVA in whole cents', function (int $htCents, int $rateBp, int $expectedVatCents): void {
    $vat = (new ComputeInvoiceAmounts)->vatFor(new Money($htCents, 'EUR'), $rateBp);

    expect((int) $vat->getAmount())->toBe($expectedVatCents);
})->with([
    'no TVA under the franchise en base' => [165_000, 0, 0],
    'standard 20 %' => [165_000, 2000, 33_000],
    'reduced 10 %' => [165_000, 1000, 16_500],
    'rounds a fifth of a cent down' => [1, 2000, 0],
    'lands exactly on a cent' => [25, 2000, 5],
    'rounds up at the midpoint' => [100, 550, 6],
    'odd amount at 20 %' => [123_457, 2000, 24_691],
    'odd amount at 5,5 %' => [99_999, 550, 5_500],
]);

test('adds the TVA to reach the gross amount', function (): void {
    $ttc = (new ComputeInvoiceAmounts)->ttcFor(new Money(165_000, 'EUR'), 2000);

    expect((int) $ttc->getAmount())->toBe(198_000);
});

test('leaves the gross amount equal to the net amount without TVA', function (): void {
    $ttc = (new ComputeInvoiceAmounts)->ttcFor(new Money(165_000, 'EUR'), 0);

    expect((int) $ttc->getAmount())->toBe(165_000);
});
