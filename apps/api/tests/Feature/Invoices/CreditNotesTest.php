<?php

declare(strict_types=1);

use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Invoices\Enums\CreditNoteKind;
use App\Domain\Invoices\Enums\CreditNoteReason;
use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\CreditNoteStatus;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Revenue\CollectedInvoices;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

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

test('a refund by transfer settles the credit note and takes its HT off the day it left', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);
    $this->actingAs($user)->postJson("/api/invoices/{$invoice->id}/pay", ['paidOn' => '2026-08-10'])->assertOk();
    $id = $this->actingAs($user)->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload([
        'kind' => CreditNoteKind::Partial->value,
        'lines' => [creditLine()],
        'settlement' => CreditNoteSettlement::Refund->value,
    ]))->json('creditNote.id');

    $this->actingAs($user)
        ->postJson("/api/invoicing/credit-notes/{$id}/refund", ['refundedOn' => '2026-08-10'])
        ->assertOk()
        ->assertJsonPath('creditNote.status', CreditNoteStatus::Settled->value)
        ->assertJsonPath('creditNote.settledOn', '2026-08-10')
        ->assertJsonPath('invoice.amountDue.amount', 0)
        ->assertJsonPath('invoice.status', InvoiceStatus::Paid->value);

    $refundDay = [CarbonImmutable::parse('2026-08-10'), CarbonImmutable::parse('2026-08-10')];
    $collected = CollectedInvoices::paidBetween($user, ...$refundDay);
    // The payment of the whole invoice, less the refund, both that day.
    expect($collected->htCents(...$refundDay))->toBe(INVOICE_HT - 10_000)
        ->and($collected->vatCents(...$refundDay))->toBe(INVOICE_TTC - INVOICE_HT - 2_000);

    $this->actingAs($user)
        ->postJson("/api/invoicing/credit-notes/{$id}/refund", ['refundedOn' => '2026-08-10'])
        ->assertStatus(409);
});

test('a refund carried by a debit of the pro account links that debit', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);
    $this->actingAs($user)->postJson("/api/invoices/{$invoice->id}/pay", ['paidOn' => '2026-08-10'])->assertOk();
    $id = $this->actingAs($user)->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload([
        'kind' => CreditNoteKind::Partial->value,
        'lines' => [creditLine()],
        'settlement' => CreditNoteSettlement::Refund->value,
    ]))->json('creditNote.id');
    $wrong = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(5_000)->on('2026-08-10'));
    $debit = bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(12_000)->on('2026-08-10'));

    $this->actingAs($user)
        ->postJson("/api/invoicing/credit-notes/{$id}/refund", ['refundedOn' => '2026-08-10', 'bankMovementId' => $wrong->id])
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('bankMovementId');

    $this->actingAs($user)
        ->postJson("/api/invoicing/credit-notes/{$id}/refund", ['refundedOn' => '2026-08-10', 'bankMovementId' => $debit->id])
        ->assertOk();

    expect($debit->refresh()->invoice_id)->toBe($invoice->id)
        ->and($invoice->payments()->where('credit_note_id', $id)->value('bank_movement_id'))->toBe($debit->id);
});

test('taking a refund back owes the money to the client again', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);
    $this->actingAs($user)->postJson("/api/invoices/{$invoice->id}/pay", ['paidOn' => '2026-08-10'])->assertOk();
    $id = $this->actingAs($user)->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload([
        'kind' => CreditNoteKind::Partial->value,
        'lines' => [creditLine()],
        'settlement' => CreditNoteSettlement::Refund->value,
    ]))->json('creditNote.id');
    $this->actingAs($user)->postJson("/api/invoicing/credit-notes/{$id}/refund", ['refundedOn' => '2026-08-10'])->assertOk();
    $refund = $invoice->payments()->where('credit_note_id', $id)->sole();

    $this->actingAs($user)
        ->deleteJson("/api/invoices/{$invoice->id}/payments/{$refund->id}")
        ->assertOk()
        ->assertJsonPath('invoice.status', InvoiceStatus::Paid->value)
        ->assertJsonPath('invoice.amountDue.amount', -12_000);

    $this->actingAs($user)->getJson("/api/invoicing/credit-notes/{$id}")->assertJsonPath('creditNote.status', CreditNoteStatus::Issued->value);
});

test('the invoiced revenue nets the credit notes in the month they were issued', function (): void {
    $user = issuableAccount();
    $invoice = issuedInvoiceOf($user);
    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$invoice->id}/credit-notes", creditNotePayload())->assertCreated();

    $this->actingAs($user)
        ->getJson('/api/revenue?period=2026-08&basis=0')
        ->assertOk()
        ->assertJsonPath('total.amount', 0);
});

test('a credit note deducted from the next invoice is settled when that invoice is issued', function (): void {
    $user = issuableAccount();
    $first = issuedInvoiceOf($user);
    $this->actingAs($user)->postJson("/api/invoices/{$first->id}/pay", ['paidOn' => '2026-08-10'])->assertOk();
    $creditNoteId = $this->actingAs($user)->postJson("/api/invoicing/invoices/{$first->id}/credit-notes", creditNotePayload([
        'kind' => CreditNoteKind::Partial->value,
        'lines' => [creditLine()],
        'settlement' => CreditNoteSettlement::DeductFromNextInvoice->value,
    ]))->json('creditNote.id');

    $this->actingAs($user)
        ->getJson("/api/invoicing/credit-notes/deductible?clientId={$first->client_id}")
        ->assertOk()
        ->assertJsonPath('creditNotes.0.creditNote.id', $creditNoteId)
        ->assertJsonPath('creditNotes.0.amount.amount', 12_000);

    $draft = draftFor($user, $first->client, ['creditNoteIds' => [$creditNoteId]]);

    $this->actingAs($user)
        ->getJson("/api/invoices/{$draft}/paper")
        ->assertOk()
        ->assertJsonPath('totals.3.label', 'Déduction de l\'avoir n° A-2026-001')
        ->assertJsonPath('totals.4.label', 'Net à payer');

    $this->actingAs($user)
        ->postJson("/api/invoicing/invoices/{$draft}/issue")
        ->assertOk()
        ->assertJsonPath('invoice.amountPaid.amount', 12_000)
        ->assertJsonPath('invoice.amountDue.amount', INVOICE_TTC - 12_000)
        ->assertJsonPath('deductedCreditNotes.0.status', CreditNoteStatus::Settled->value);

    $this->actingAs($user)->getJson("/api/invoices/{$first->id}")->assertJsonPath('invoice.amountDue.amount', 0);

    // The two sides cancel out that day: only real money is collected.
    $day = [CarbonImmutable::parse('2026-08-10'), CarbonImmutable::parse('2026-08-10')];
    expect(CollectedInvoices::paidBetween($user, ...$day)->htCents(...$day))->toBe(INVOICE_HT);

    $this->actingAs($user)->getJson("/api/invoicing/credit-notes/deductible?clientId={$first->client_id}")->assertJsonCount(0, 'creditNotes');
});

test('a credit note to deduct belongs to one draft of the same client', function (): void {
    $user = issuableAccount();
    $first = issuedInvoiceOf($user);
    $this->actingAs($user)->postJson("/api/invoices/{$first->id}/pay", ['paidOn' => '2026-08-10'])->assertOk();
    $creditNoteId = $this->actingAs($user)->postJson("/api/invoicing/invoices/{$first->id}/credit-notes", creditNotePayload([
        'kind' => CreditNoteKind::Partial->value,
        'lines' => [creditLine()],
        'settlement' => CreditNoteSettlement::DeductFromNextInvoice->value,
    ]))->json('creditNote.id');
    draftFor($user, $first->client, ['creditNoteIds' => [$creditNoteId]]);

    $this->actingAs($user)
        ->postJson('/api/invoicing/invoices', draftPayloadFor($first->client, ['creditNoteIds' => [$creditNoteId]]))
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('creditNoteIds');
    $this->actingAs($user)
        ->postJson('/api/invoicing/invoices', draftPayloadFor(billableClient($user, ['name' => 'Callisto']), ['creditNoteIds' => [$creditNoteId]]))
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('creditNoteIds');
});
