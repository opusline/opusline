<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\CreditNoteKind;
use App\Domain\Invoices\Enums\CreditNoteReason;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Enums\QuoteBilling;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\TestResponse;

beforeEach(function (): void {
    $this->travelTo('2026-08-10 12:00:00');
    Storage::fake('local');
});

/** An accepted quote with 1 200 € at 20 % and 500 € at 10 % before tax, a 30 % deposit asked. */
function acceptedQuote(User $user, array $overrides = []): int
{
    $client = billableClient($user);
    $id = quoteDraftFor($user, $client, [
        'title' => 'Refonte du site',
        'lines' => [
            ['label' => 'Développement', 'quantityMilli' => 2000, 'unit' => LineUnit::Day->value, 'unitPrice' => ['amount' => 60_000, 'currency' => 'EUR'], 'vatRateBp' => 2000],
            ['label' => 'Contenus imprimés', 'quantityMilli' => 1000, 'unit' => LineUnit::Flat->value, 'unitPrice' => ['amount' => 50_000, 'currency' => 'EUR'], 'vatRateBp' => 1000],
        ],
        ...$overrides,
    ]);
    test()->actingAs($user)->postJson("/api/invoicing/quotes/{$id}/issue")->assertOk();
    test()->actingAs($user)->postJson("/api/invoicing/quotes/{$id}/accept")->assertOk();

    return $id;
}

function invoiceQuote(User $user, int $quoteId, QuoteBilling $billing): TestResponse
{
    return test()->actingAs($user)->postJson("/api/invoicing/quotes/{$quoteId}/invoices", ['billing' => $billing->value]);
}

test('builds the deposit invoice per VAT rate, so its VAT follows each rate', function (): void {
    $user = issuableAccount();
    $quoteId = acceptedQuote($user);

    $response = invoiceQuote($user, $quoteId, QuoteBilling::Deposit)
        ->assertCreated()
        ->assertJsonPath('invoice.status', InvoiceStatus::Draft->value)
        ->assertJsonPath('quote.quoteId', $quoteId)
        ->assertJsonPath('quote.number', 'D-2026-001')
        ->assertJsonPath('quote.billing', QuoteBilling::Deposit->value)
        ->assertJsonPath('content.title', 'Acompte · Refonte du site')
        ->assertJsonCount(2, 'content.lines')
        ->assertJsonPath('content.lines.0.label', 'Acompte de 30 % sur le devis n° D-2026-001')
        ->assertJsonPath('content.lines.0.detail', 'Part soumise à la TVA à 20 %')
        ->assertJsonPath('content.lines.0.unitPrice.amount', 36_000)
        ->assertJsonPath('content.lines.0.vatRateBp', 2000)
        ->assertJsonPath('content.lines.1.unitPrice.amount', 15_000)
        ->assertJsonPath('content.lines.1.vatRateBp', 1000)
        ->assertJsonPath('invoice.amountHt.amount', 51_000)
        // 36 000 × 1,2 + 15 000 × 1,1: thirty percent of the quote's 199 000 TTC, to the cent.
        ->assertJsonPath('invoice.amountTtc.amount', 59_700);

    $id = $response->json('invoice.id');
    test()->actingAs($user)->getJson("/api/invoices/{$id}/paper")
        ->assertJsonPath('legal', fn (string $legal): bool => str_contains($legal, "Facture d'acompte de 30 % sur le devis n° D-2026-001."));
    test()->actingAs($user)->getJson("/api/invoicing/quotes/{$quoteId}")
        ->assertJsonPath('billing.invoices.0.id', $id)
        ->assertJsonPath('billing.invoices.0.billing', QuoteBilling::Deposit->value)
        ->assertJsonPath('billing.invoicedTtc.amount', 0)
        ->assertJsonPath('billing.canInvoiceDeposit', false)
        ->assertJsonPath('billing.canInvoiceBalance', false)
        ->assertJsonPath('billing.canInvoiceFull', false);
});

test('builds the balance from the quote minus every deposit issued, per rate', function (): void {
    $user = issuableAccount();
    $quoteId = acceptedQuote($user);
    $deposit = invoiceQuote($user, $quoteId, QuoteBilling::Deposit)->json('invoice.id');
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$deposit}/issue")->assertOk();

    test()->actingAs($user)->getJson("/api/invoicing/quotes/{$quoteId}")
        ->assertJsonPath('billing.invoicedTtc.amount', 59_700)
        ->assertJsonPath('billing.canInvoiceBalance', true);

    $response = invoiceQuote($user, $quoteId, QuoteBilling::Balance)
        ->assertCreated()
        ->assertJsonPath('quote.billing', QuoteBilling::Balance->value)
        ->assertJsonPath('content.title', 'Solde · Refonte du site')
        ->assertJsonCount(4, 'content.lines')
        ->assertJsonPath('content.lines.0.label', 'Développement')
        ->assertJsonPath('content.lines.2.label', 'Acompte facturé · 2026-001 du 10/08/2026')
        ->assertJsonPath('content.lines.2.unitPrice.amount', -36_000)
        ->assertJsonPath('content.lines.2.vatRateBp', 2000)
        ->assertJsonPath('content.lines.3.unitPrice.amount', -15_000)
        ->assertJsonPath('content.lines.3.vatRateBp', 1000)
        ->assertJsonPath('invoice.amountHt.amount', 119_000)
        // The deposit and the balance add up to the quote: 59 700 + 139 300 = 199 000.
        ->assertJsonPath('invoice.amountTtc.amount', 139_300);

    $id = $response->json('invoice.id');
    test()->actingAs($user)->getJson("/api/invoices/{$id}/paper")
        ->assertJsonPath('legal', fn (string $legal): bool => str_contains($legal, "Établie au titre du devis n° D-2026-001. Acompte déjà facturé et déduit : n° 2026-001 du 10/08/2026 (597,00\u{00A0}€ TTC)."));
    test()->actingAs($user)->getJson("/api/invoicing/quotes/{$quoteId}")
        ->assertJsonCount(2, 'billing.invoices')
        ->assertJsonPath('billing.canInvoiceBalance', false);
});

test('bills a quote afresh once a credit note cancelled its deposit', function (): void {
    $user = issuableAccount();
    $quoteId = acceptedQuote($user);
    $deposit = invoiceQuote($user, $quoteId, QuoteBilling::Deposit)->json('invoice.id');
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$deposit}/issue")->assertOk();
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$deposit}/credit-notes", [
        'kind' => CreditNoteKind::Full->value,
        'reason' => CreditNoteReason::ServiceCancelled->value,
        'lines' => [],
    ])->assertCreated();

    test()->actingAs($user)->getJson("/api/invoicing/quotes/{$quoteId}")
        ->assertJsonPath('billing.invoicedTtc.amount', 0)
        ->assertJsonPath('billing.canInvoiceDeposit', true)
        ->assertJsonPath('billing.canInvoiceBalance', false)
        ->assertJsonPath('billing.canInvoiceFull', true);

    invoiceQuote($user, $quoteId, QuoteBilling::Full)
        ->assertCreated()
        ->assertJsonCount(2, 'content.lines')
        ->assertJsonPath('invoice.amountTtc.amount', 199_000);
});

test('deducts from the balance only what a credit note left of the deposit', function (): void {
    $user = issuableAccount();
    $quoteId = acceptedQuote($user);
    $deposit = invoiceQuote($user, $quoteId, QuoteBilling::Deposit)->json('invoice.id');
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$deposit}/issue")->assertOk();
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$deposit}/credit-notes", [
        'kind' => CreditNoteKind::Partial->value,
        'reason' => CreditNoteReason::CommercialGesture->value,
        'lines' => [[
            'label' => 'Geste commercial',
            'quantityMilli' => 1000,
            'unit' => LineUnit::Flat->value,
            'unitPrice' => ['amount' => 10_000, 'currency' => 'EUR'],
            'vatRateBp' => 2000,
        ]],
    ])->assertCreated();

    invoiceQuote($user, $quoteId, QuoteBilling::Balance)
        ->assertCreated()
        ->assertJsonCount(4, 'content.lines')
        ->assertJsonPath('content.lines.2.unitPrice.amount', -26_000)
        ->assertJsonPath('content.lines.2.vatRateBp', 2000)
        ->assertJsonPath('content.lines.3.unitPrice.amount', -15_000)
        ->assertJsonPath('content.lines.3.vatRateBp', 1000);
});

test('names on the balance only the deposit left after its credit note', function (): void {
    $user = issuableAccount();
    $quoteId = acceptedQuote($user);
    $deposit = invoiceQuote($user, $quoteId, QuoteBilling::Deposit)->json('invoice.id');
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$deposit}/issue")->assertOk();
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$deposit}/credit-notes", [
        'kind' => CreditNoteKind::Partial->value,
        'reason' => CreditNoteReason::CommercialGesture->value,
        'lines' => [[
            'label' => 'Geste commercial',
            'quantityMilli' => 1000,
            'unit' => LineUnit::Flat->value,
            'unitPrice' => ['amount' => 10_000, 'currency' => 'EUR'],
            'vatRateBp' => 2000,
        ]],
    ])->assertCreated();
    $balance = invoiceQuote($user, $quoteId, QuoteBilling::Balance)->json('invoice.id');

    // 597,00 € less the 120,00 € the credit note took back.
    test()->actingAs($user)->getJson("/api/invoices/{$balance}/paper")
        ->assertJsonPath('legal', fn (string $legal): bool => str_contains($legal, "(477,00\u{00A0}€ TTC)"));
});

test('bills the whole quote at once while nothing was invoiced, and only then', function (): void {
    $user = issuableAccount();
    $quoteId = acceptedQuote($user);

    invoiceQuote($user, $quoteId, QuoteBilling::Full)
        ->assertCreated()
        ->assertJsonPath('content.title', 'Refonte du site')
        ->assertJsonCount(2, 'content.lines')
        ->assertJsonPath('invoice.amountTtc.amount', 199_000);

    invoiceQuote($user, $quoteId, QuoteBilling::Full)->assertConflict()->assertJsonPath('message', __('quotes.already_invoiced'));
    invoiceQuote($user, $quoteId, QuoteBilling::Deposit)->assertConflict();
});

test('refuses to bill what the quote does not allow yet', function (callable $arrange, QuoteBilling $billing, string $message): void {
    $user = issuableAccount();
    $quoteId = $arrange($user);

    invoiceQuote($user, $quoteId, $billing)
        ->assertConflict()
        ->assertJsonPath('message', __($message));
})->with([
    'a balance before any deposit' => [fn (User $user): int => acceptedQuote($user), QuoteBilling::Balance, 'quotes.balance_needs_deposit'],
    'a second deposit' => [function (User $user): int {
        $quoteId = acceptedQuote($user);
        invoiceQuote($user, $quoteId, QuoteBilling::Deposit)->assertCreated();

        return $quoteId;
    }, QuoteBilling::Deposit, 'quotes.deposit_already_invoiced'],
    // A deposit still in draft bills nothing yet: the balance waits for it to go out.
    'a balance behind a draft deposit' => [function (User $user): int {
        $quoteId = acceptedQuote($user);
        invoiceQuote($user, $quoteId, QuoteBilling::Deposit)->assertCreated();

        return $quoteId;
    }, QuoteBilling::Balance, 'quotes.balance_needs_deposit'],
    'a quote not accepted' => [function (User $user): int {
        $quoteId = quoteDraftFor($user, billableClient($user));
        test()->actingAs($user)->postJson("/api/invoicing/quotes/{$quoteId}/issue")->assertOk();

        return $quoteId;
    }, QuoteBilling::Full, 'quotes.cannot_invoice_unless_accepted'],
]);

test('offers no deposit when the quote asked none', function (): void {
    $user = issuableAccount();
    $quoteId = acceptedQuote($user, ['depositRateBp' => null]);

    test()->actingAs($user)->getJson("/api/invoicing/quotes/{$quoteId}")
        ->assertJsonPath('billing.canInvoiceDeposit', false)
        ->assertJsonPath('billing.canInvoiceFull', true);
    invoiceQuote($user, $quoteId, QuoteBilling::Deposit)->assertConflict();
});

test('keeps another account\'s quote from being invoiced', function (): void {
    $owner = issuableAccount();
    $quoteId = acceptedQuote($owner);

    invoiceQuote(vatLiableUser(), $quoteId, QuoteBilling::Full)->assertNotFound();
    expect(Invoice::query()->count())->toBe(0);
});
