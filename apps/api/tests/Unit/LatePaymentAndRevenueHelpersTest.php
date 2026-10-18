<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\LatePayment\LegalReference;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Revenue\PaymentDelay;
use App\Domain\Invoices\Revenue\RevenueWindow;
use Carbon\CarbonImmutable;

function legalReference(int $legalInterestRateBp, int $ecbRateBp): LegalReference
{
    return new LegalReference(
        semester: '2026-S2',
        checkedOn: CarbonImmutable::parse('2026-07-01'),
        nextRevisionOn: CarbonImmutable::parse('2027-01-01'),
        legalInterestRateBp: $legalInterestRateBp,
        ecbRateBp: $ecbRateBp,
        recoveryFeeCents: 4_000,
        sources: [],
    );
}

/** An invoice as the ledger query hands it over, its last payment day selected. */
function invoiceIssuedOn(string $issuedOn, InvoiceStatus $status, ?string $lastPaidOn): Invoice
{
    return (new Invoice)->setRawAttributes([
        'issued_on' => $issuedOn,
        'status' => $status->value,
        'last_paid_on' => $lastPaidOn,
    ]);
}

test('a contractual penalty rate may not fall below three times the legal interest rate', function (): void {
    expect(legalReference(legalInterestRateBp: 671, ecbRateBp: 215)->minimumPenaltyRateBp())->toBe(2_013);
});

test('without a stated rate, the client owes the ECB rate plus ten points', function (): void {
    expect(legalReference(legalInterestRateBp: 671, ecbRateBp: 215)->statutoryPenaltyRateBp())->toBe(1_215);
});

test('averages the days from issue to payment over the paid invoices only', function (): void {
    $delay = PaymentDelay::averageDays([
        invoiceIssuedOn('2026-08-01', InvoiceStatus::Paid, '2026-08-11'),
        invoiceIssuedOn('2026-08-01', InvoiceStatus::Paid, '2026-08-31'),
        invoiceIssuedOn('2026-08-01', InvoiceStatus::Sent, '2026-08-05'),
    ]);

    expect($delay)->toBe(20);
});

test('has no payment delay before an invoice is paid', function (): void {
    expect(PaymentDelay::averageDays([invoiceIssuedOn('2026-08-01', InvoiceStatus::Sent, null)]))->toBeNull();
});

test('counts the months between two dates, both ends included, never fewer than one', function (string $from, ?string $until, int $months): void {
    $window = RevenueWindow::around(CarbonImmutable::parse('2026-08-14'), 'EUR', 420);

    expect($window->monthsBetween(CarbonImmutable::parse($from), $until === null ? null : CarbonImmutable::parse($until)))->toBe($months);
})->with([
    'same month' => ['2026-08-02', '2026-08-30', 1],
    'three months' => ['2026-06-15', '2026-08-01', 3],
    'up to the window\'s month' => ['2026-03-01', null, 6],
    'a date ahead of the end' => ['2026-10-01', '2026-08-01', 1],
]);
