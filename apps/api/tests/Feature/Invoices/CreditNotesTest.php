<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\CreditNoteKind;
use App\Domain\Invoices\Enums\CreditNoteReason;
use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\CreditNoteStatus;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;

// The default draft: 19 days at 550 € HT, 20 % VAT.
const INVOICE_HT = 1_045_000;
const INVOICE_TTC = 1_254_000;

beforeEach(function (): void {
    $this->travelTo('2026-08-10 12:00:00');
});

/** An invoice written and issued in Opusline, as a credit note finds it. */
function issuedInvoiceOf(User $user): Invoice
{
    $client = $user->clients()->first() ?? billableClient($user);
    $id = draftFor($user, $client);
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue")->assertOk();

    return Invoice::query()->findOrFail($id);
}

/** @param array<string, mixed> $overrides */
function creditNotePayload(array $overrides = []): array
{
    return array_merge([
        'kind' => CreditNoteKind::Full->value,
        'reason' => CreditNoteReason::BillingError->value,
        'detail' => '1 h de maintenance comptée deux fois',
        'lines' => [],
    ], $overrides);
}

/** @param array<string, mixed> $overrides */
function creditLine(array $overrides = []): array
{
    return array_merge([
        'label' => 'Remise',
        'quantityMilli' => 1000,
        'unit' => LineUnit::Flat->value,
        'unitPrice' => ['amount' => 10_000, 'currency' => 'EUR'],
        'vatRateBp' => 2000,
    ], $overrides);
}

test('a full credit note on an unpaid invoice cancels it, numbered in its own series', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload())
        ->assertCreated()
        ->assertJsonPath('creditNote.number', 'A-2026-001')
        ->assertJsonPath('creditNote.issuedOn', '2026-08-10')
        ->assertJsonPath('creditNote.settlement', CreditNoteSettlement::CancelsInvoice->value)
        ->assertJsonPath('creditNote.status', CreditNoteStatus::Settled->value)
        ->assertJsonPath('creditNote.amountTtc.amount', INVOICE_TTC)
        ->assertJsonPath('creditNote.amountHt.amount', INVOICE_HT)
        ->assertJsonPath('lines.0.label', 'Journée de développement frontend')
        ->assertJsonPath('invoice.status', InvoiceStatus::Cancelled->value)
        ->assertJsonPath('invoice.amountDue.amount', 0);

    expect($invoice->events()->where('kind', InvoiceEventKind::CreditNoteIssued)->value('note'))->toBe('A-2026-001')
        ->and($invoice->client->media()->where('custom_properties->creditNoteId', $invoice->creditNotes()->sole()->id)->exists())->toBeTrue();
});

test('a partial credit note on an unpaid invoice reduces what is due', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload([
            'kind' => CreditNoteKind::Partial->value,
            'reason' => CreditNoteReason::CommercialGesture->value,
            'lines' => [creditLine()],
        ]))
        ->assertCreated()
        ->assertJsonPath('creditNote.settlement', CreditNoteSettlement::ReducesBalance->value)
        ->assertJsonPath('creditNote.amountTtc.amount', 12_000)
        ->assertJsonPath('invoice.status', InvoiceStatus::Sent->value)
        ->assertJsonPath('invoice.amountCredited.amount', 12_000)
        ->assertJsonPath('invoice.amountDue.amount', INVOICE_TTC - 12_000);
});

test('a line taken back from the invoice keeps the rate it was invoiced at', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);
    $line = $invoice->lines()->sole();

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload([
            'kind' => CreditNoteKind::Partial->value,
            'lines' => [creditLine(['invoiceLineId' => $line->id, 'vatRateBp' => 0, 'unitPrice' => ['amount' => 55_000, 'currency' => 'EUR']])],
        ]))
        ->assertCreated()
        ->assertJsonPath('lines.0.invoiceLineId', $line->id)
        ->assertJsonPath('lines.0.vatRateBp', 2000)
        ->assertJsonPath('creditNote.amountTtc.amount', 66_000);
});

test('the balance credit note takes back what is left to pay', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);

    $this->actingAs($user)->postJson("/api/invoices/{$invoice->id}/pay", [
        'paidOn' => '2026-08-10',
        'amount' => ['amount' => 254_000, 'currency' => 'EUR'],
    ])->assertOk();

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload(['kind' => CreditNoteKind::Balance->value]))
        ->assertCreated()
        ->assertJsonPath('creditNote.amountTtc.amount', 1_000_000)
        ->assertJsonPath('creditNote.settlement', CreditNoteSettlement::ReducesBalance->value)
        ->assertJsonPath('lines.0.label', 'Annulation du solde de la facture n° '.$invoice->number)
        // The money received now covers what is left: the invoice is paid.
        ->assertJsonPath('invoice.status', InvoiceStatus::Paid->value)
        ->assertJsonPath('invoice.amountDue.amount', 0);
});

test('a credit note on a paid invoice asks what becomes of the money', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);
    $this->actingAs($user)->postJson("/api/invoices/{$invoice->id}/pay", ['paidOn' => '2026-08-10'])->assertOk();
    $partial = creditNotePayload(['kind' => CreditNoteKind::Partial->value, 'lines' => [creditLine()]]);

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", $partial)
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('settlement');

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", [...$partial, 'settlement' => CreditNoteSettlement::Refund->value])
        ->assertCreated()
        ->assertJsonPath('creditNote.settlement', CreditNoteSettlement::Refund->value)
        ->assertJsonPath('creditNote.status', CreditNoteStatus::Issued->value)
        ->assertJsonPath('creditNote.settledOn', null)
        ->assertJsonPath('invoice.status', InvoiceStatus::Paid->value)
        // The client is owed it back.
        ->assertJsonPath('invoice.amountDue.amount', -12_000);
});

test('refuses a credit note larger than what is left on the invoice', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload([
            'kind' => CreditNoteKind::Partial->value,
            'lines' => [creditLine(['unitPrice' => ['amount' => INVOICE_HT + 1, 'currency' => 'EUR']])],
        ]))
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('lines');

    expect($invoice->creditNotes()->count())->toBe(0);
});

test('refuses a full credit note after a partial one', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);
    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload([
        'kind' => CreditNoteKind::Partial->value,
        'lines' => [creditLine()],
    ]))->assertCreated();

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload())
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('kind');
});

test('a cancelled invoice takes no further credit note, nor a draft one', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);
    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload())->assertCreated();
    $draft = draftFor($user, $invoice->client);

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload(['kind' => CreditNoteKind::Partial->value, 'lines' => [creditLine()]]))
        ->assertStatus(409);
    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$draft}/credit-notes", creditNotePayload())
        ->assertStatus(409);
});

test('a cancelled invoice takes no payment', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);
    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload())->assertCreated();

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/pay", ['paidOn' => '2026-08-10'])
        ->assertStatus(409);
});

test('the preview prints the credit note without issuing it', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes/paper", creditNotePayload())
        ->assertOk()
        ->assertJsonPath('title', 'Avoir')
        ->assertJsonPath('stamp', 'Brouillon')
        ->assertJsonPath('meta.1.value', 'n° '.$invoice->number.' du 10/08/2026')
        ->assertJsonPath('meta.2.value', 'Erreur de facturation')
        ->assertJsonPath('description', '1 h de maintenance comptée deux fois');

    expect($invoice->creditNotes()->count())->toBe(0);
});

test('an issued credit note is shown, printed and downloaded by its owner only', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);
    $id = $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload())
        ->json('creditNote.id');

    $this->actingAs($user)->getJson("/api/invoicing/credit-notes/{$id}")->assertOk()->assertJsonPath('creditNote.number', 'A-2026-001');
    $this->actingAs($user)->getJson("/api/invoicing/credit-notes/{$id}/paper")->assertOk()->assertJsonPath('title', 'Avoir n° A-2026-001');
    $this->actingAs($user)->get("/api/invoicing/credit-notes/{$id}/pdf")->assertOk();
    $this->actingAs($user)->getJson("/api/invoices/{$invoice->id}")->assertJsonPath('creditNotes.0.id', $id);

    $stranger = issuableAccount();
    $this->actingAs($stranger)->getJson("/api/invoicing/credit-notes/{$id}")->assertNotFound();
    $this->actingAs($stranger)->getJson("/api/invoicing/credit-notes/{$id}/paper")->assertNotFound();
    $this->actingAs($stranger)->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload())->assertNotFound();
});

test('the credit notes keep their own continuous series', function (): void {
    $user = issuableAccount();
    $first = issuedInvoiceOf($user);
    $second = issuedInvoiceOf($user);

    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$first->id}/credit-notes", creditNotePayload())->assertCreated();
    $this->actingAs($user)
        ->getJson('/api/invoicing/settings')
        ->assertJsonPath('nextCreditNoteNumber', 'A-2026-002')
        ->assertJsonPath('creditNoteNumberFormat', 'A-AAAA-NNN');

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$second->id}/credit-notes", creditNotePayload())
        ->assertJsonPath('creditNote.number', 'A-2026-002');
});

test('refuses a partial credit note without lines, or with a line of another invoice', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);
    $other = issuedInvoiceOf($user);

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload(['kind' => CreditNoteKind::Partial->value]))
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('lines');
    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload([
            'kind' => CreditNoteKind::Partial->value,
            'lines' => [creditLine(['invoiceLineId' => $other->lines()->sole()->id])],
        ]))
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('lines.0.invoiceLineId');
});

test('an invoice recorded from another tool cannot be created cancelled', function (): void {
    $user = issuableAccount();

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => billableClient($user)->id,
            'number' => '2026-099',
            'status' => InvoiceStatus::Cancelled->value,
            'issuedOn' => '2026-08-01',
            'amountHt' => ['amount' => 100_000, 'currency' => 'EUR'],
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('status');
});
