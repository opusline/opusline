<?php

declare(strict_types=1);

use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Vat\ExpenseAmounts;
use Cknow\Money\Money;

test('derives the net amount from a domestic gross one, rounding half up to the cent', function (int $ttcCents, int $rateBp, int $htCents): void {
    $amounts = ExpenseAmounts::fromTtc(new Money($ttcCents, 'EUR'), ExpenseVatTreatment::Domestic, $rateBp);

    expect((int) $amounts->ht->getAmount())->toBe($htCents)
        ->and((int) $amounts->invoicedVat()->getAmount())->toBe($ttcCents - $htCents)
        ->and($amounts->assessedVat()->equals($amounts->invoicedVat()))->toBeTrue();
})->with([
    '20 % on 14,39' => [1_439, 2_000, 1_199],
    '20 % on 29,00' => [2_900, 2_000, 2_417],
    '10 % on 89,00' => [8_900, 1_000, 8_091],
    '5,5 % on 12,00' => [1_200, 550, 1_137],
    '2,1 % on 100,00' => [10_000, 210, 9_794],
    'a cent at 20 %' => [1, 2_000, 1],
    'ten cents at 20 %' => [10, 2_000, 8],
]);

test('a reverse-charged purchase carries no invoiced TVA but self-assesses it at the rate', function (ExpenseVatTreatment $treatment): void {
    $amounts = ExpenseAmounts::fromTtc(new Money(4_800, 'EUR'), $treatment, 2_000);

    expect((int) $amounts->ht->getAmount())->toBe(4_800)
        ->and((int) $amounts->invoicedVat()->getAmount())->toBe(0)
        ->and((int) $amounts->assessedVat()->getAmount())->toBe(960);
})->with([
    'EU supplier' => [ExpenseVatTreatment::ReverseChargeEu],
    'non-EU supplier' => [ExpenseVatTreatment::ReverseChargeNonEu],
]);

test('an exempt purchase has no TVA at all', function (): void {
    $amounts = ExpenseAmounts::fromTtc(new Money(31_200, 'EUR'), ExpenseVatTreatment::Exempt, 0);

    expect((int) $amounts->ht->getAmount())->toBe(31_200)
        ->and((int) $amounts->assessedVat()->getAmount())->toBe(0)
        ->and((int) $amounts->recoverableVat(10_000)->getAmount())->toBe(0);
});

test('only the professional share of the TVA is recoverable', function (): void {
    $amounts = ExpenseAmounts::fromTtc(new Money(2_900, 'EUR'), ExpenseVatTreatment::Domestic, 2_000);

    expect((int) $amounts->recoverableVat(10_000)->getAmount())->toBe(483)
        ->and((int) $amounts->recoverableVat(7_000)->getAmount())->toBe(338)
        ->and((int) $amounts->recoverableVat(0)->getAmount())->toBe(0);
});
