<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\CreditNoteKind;
use App\Domain\Invoices\Enums\CreditNoteReason;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\InvoicePayment;
use App\Domain\Settings\Models\ContributionRate;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/** A French account at 26 % cotisations plus the 0,2 % CFP, off the versement libératoire. */
function netAccount(array $settings = []): User
{
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'contribution_rate_bp' => 2_600,
        'liberating_payment' => false,
        'income_tax_rate_bp' => null,
        ...$settings,
    ]);

    return $user;
}

/** 19 days at 550 € HT, 20 % TVA, written and issued in Opusline. */
function netInvoiceIssuedBy(User $user): Invoice
{
    $id = draftFor($user, billableClient($user));
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue")->assertOk();

    return Invoice::query()->findOrFail($id);
}

function sentInvoiceOf(User $user, int $htCents): Invoice
{
    return invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['amount_ht_cents' => $htCents]));
}

test('carries the net on the invoice list', function (): void {
    $user = netAccount();
    // Each URSSAF line rounds on its own: 12 345 × 26 % = 3 209,70 → 3 210,
    // plus 12 345 × 0,2 % = 24,69 → 25.
    sentInvoiceOf($user, 12_345);

    $this->actingAs($user)
        ->getJson('/api/invoices?status=1')
        ->assertOk()
        ->assertJsonPath('invoices.0.invoice.amountNet', ['amount' => 9_110, 'currency' => 'EUR']);
});

test('carries the net on the invoice detail', function (): void {
    $user = netAccount();
    $invoice = sentInvoiceOf($user, 12_345);

    $this->actingAs($user)
        ->getJson('/api/invoices/'.$invoice->id)
        ->assertOk()
        ->assertJsonPath('invoice.amountNet', ['amount' => 9_110, 'currency' => 'EUR']);
});

test('deducts the income tax on the receipt less the abatement', function (): void {
    $user = netAccount(['income_tax_rate_bp' => 750]);
    // 10 000 € less 2 600 € cotisations and 20 € CFP, less 7,5 % of 6 600 €.
    $invoice = sentInvoiceOf($user, 1_000_000);

    $this->actingAs($user)
        ->getJson('/api/invoices/'.$invoice->id)
        ->assertOk()
        ->assertJsonPath('invoice.amountNet.amount', 688_500);
});

test('deducts the versement libératoire with the URSSAF instead of the income tax', function (): void {
    $user = netAccount(['liberating_payment' => true, 'liberating_payment_rate_bp' => 220, 'income_tax_rate_bp' => 750]);
    // 10 000 € less 2 600 € cotisations, 20 € CFP and 220 € versement libératoire.
    $invoice = sentInvoiceOf($user, 1_000_000);

    $this->actingAs($user)
        ->getJson('/api/invoices/'.$invoice->id)
        ->assertOk()
        ->assertJsonPath('invoice.amountNet.amount', 716_000);
});

test('prices a payment at the rate its declaration period settled at', function (): void {
    $user = netAccount();
    ContributionRate::query()->create(['user_id' => $user->id, 'effective_rate_bp' => 1_250, 'effective_from' => '2025-01-01']);
    ContributionRate::query()->create(['user_id' => $user->id, 'effective_rate_bp' => 2_620, 'effective_from' => '2026-01-01']);
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid('2025-05-10')->state([
        'issued_on' => '2025-04-10',
        'due_on' => '2025-05-10',
        'amount_ht_cents' => 1_000_000,
        'amount_ttc_cents' => 1_200_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/invoices/'.$invoice->id)
        ->assertOk()
        ->assertJsonPath('invoice.amountNet.amount', 875_000);
});

test('prices each payment on its day and the balance on today', function (): void {
    $user = netAccount();
    ContributionRate::query()->create(['user_id' => $user->id, 'effective_rate_bp' => 1_250, 'effective_from' => '2025-01-01']);
    ContributionRate::query()->create(['user_id' => $user->id, 'effective_rate_bp' => 2_620, 'effective_from' => '2026-01-01']);
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2025-04-10',
        'due_on' => '2025-05-10',
        'amount_ht_cents' => 1_000_000,
        'amount_ttc_cents' => 1_200_000,
    ]));
    InvoicePayment::factory()->for($invoice)->create([
        'user_id' => $user->id,
        'amount_cents' => 600_000,
        'paid_on' => '2025-05-10',
    ]);

    // Half the HT collected under 12,5 %, half still due under 26 % + 0,2 % CFP.
    $this->actingAs($user)
        ->getJson('/api/invoices/'.$invoice->id)
        ->assertOk()
        ->assertJsonPath('invoice.amountNet.amount', 437_500 + 369_000);
});

test('takes a credit note off the net', function (): void {
    $user = issuableAccount(['contribution_rate_bp' => 2_600, 'liberating_payment' => false, 'income_tax_rate_bp' => null]);
    $invoice = netInvoiceIssuedBy($user);

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", [
            'kind' => CreditNoteKind::Partial->value,
            'reason' => CreditNoteReason::CommercialGesture->value,
            'detail' => 'Geste commercial',
            'lines' => [[
                'label' => 'Remise',
                'quantityMilli' => 1000,
                'unit' => LineUnit::Flat->value,
                'unitPrice' => ['amount' => 10_000, 'currency' => 'EUR'],
                'vatRateBp' => 2000,
            ]],
        ])
        ->assertCreated();

    // 10 450 € HT less the 100 € credited, less 26 % + 0,2 % CFP.
    $this->actingAs($user)
        ->getJson('/api/invoices/'.$invoice->id)
        ->assertOk()
        ->assertJsonPath('invoice.amountNet.amount', 763_830);
});

test('nets a cancelled invoice to zero', function (): void {
    $user = issuableAccount();
    $invoice = netInvoiceIssuedBy($user);

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", [
            'kind' => CreditNoteKind::Full->value,
            'reason' => CreditNoteReason::BillingError->value,
            'detail' => 'Erreur de facturation',
            'lines' => [],
        ])
        ->assertCreated();

    $this->actingAs($user)
        ->getJson('/api/invoices/'.$invoice->id)
        ->assertOk()
        ->assertJsonPath('invoice.status', InvoiceStatus::Cancelled->value)
        ->assertJsonPath('invoice.amountNet.amount', 0);
});

test('has no net it could only guess', function (callable $arrange): void {
    $user = netAccount();
    $invoice = $arrange($user);

    $this->actingAs($user)
        ->getJson('/api/invoices/'.$invoice->id)
        ->assertOk()
        ->assertJsonPath('invoice.amountNet', null);
})->with([
    'a draft, whose amount can still change' => [fn (User $user): Invoice => invoiceOwnedBy($user)],
    'an account outside french fiscality' => [function (User $user): Invoice {
        $user->settings()->sole()->update(['business_country' => 'DE']);

        return sentInvoiceOf($user, 12_345);
    }],
]);
