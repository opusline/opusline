<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Revenue\CollectedInvoices;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

beforeEach(function (): void {
    $this->travelTo('2026-08-10 12:00:00');
});

/** 1 200 € HT at 20 % and 500 € HT at 10 %: 1 990 € TTC, issued. */
function mixedRateInvoice(User $user): int
{
    $id = draftFor($user, billableClient($user), ['lines' => [
        ['label' => 'Développement', 'quantityMilli' => 2000, 'unit' => LineUnit::Day->value, 'unitPrice' => ['amount' => 60_000, 'currency' => 'EUR'], 'vatRateBp' => 2000],
        ['label' => 'Contenus imprimés', 'quantityMilli' => 1000, 'unit' => LineUnit::Flat->value, 'unitPrice' => ['amount' => 50_000, 'currency' => 'EUR'], 'vatRateBp' => 1000],
    ]]);
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue")->assertOk();

    return $id;
}

test('totals an invoice billed at two rates rate by rate', function (): void {
    $user = issuableAccount();
    $id = mixedRateInvoice($user);

    $this->actingAs($user)
        ->getJson("/api/invoices/{$id}")
        ->assertJsonPath('invoice.amountHt.amount', 170_000)
        ->assertJsonPath('invoice.amountTtc.amount', 199_000);
});

test('prints one VAT row per rate on the sheet', function (): void {
    $user = issuableAccount();
    $id = mixedRateInvoice($user);

    $rows = collect($this->actingAs($user)->getJson("/api/invoices/{$id}/paper")->assertOk()->json('vatRows'));

    expect($rows)->toHaveCount(2)
        ->and($rows->pluck('amount')->all())->toBe(["240,00\u{00A0}€", "50,00\u{00A0}€"]);
});

test('splits a partial payment between HT and VAT in the invoice\'s own mix', function (): void {
    $user = issuableAccount();
    $id = mixedRateInvoice($user);

    $this->actingAs($user)->postJson("/api/invoices/{$id}/pay", [
        'paidOn' => '2026-08-10',
        'amount' => ['amount' => 99_500, 'currency' => 'EUR'],
    ])->assertOk();

    $day = [CarbonImmutable::parse('2026-08-10'), CarbonImmutable::parse('2026-08-10')];
    $collected = CollectedInvoices::paidBetween($user, ...$day);
    // Half the invoice: half of 1 700 € HT and half of its 290 € VAT.
    expect($collected->htCents(...$day))->toBe(85_000)
        ->and($collected->vatCents(...$day))->toBe(14_500);
});
