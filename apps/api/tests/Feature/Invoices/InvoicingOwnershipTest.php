<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\CreditNoteKind;
use App\Domain\Invoices\Enums\CreditNoteReason;

/*
 * RouteOwnershipTest proves every bound model resolves through the account;
 * these walk the invoicing routes it covers structurally, as a stranger.
 */
test('a stranger cannot reach another account\'s invoicing documents', function (string $method, string $route): void {
    $owner = issuableAccount();
    $client = billableClient($owner);
    $invoiceId = draftFor($owner, $client);
    $this->actingAs($owner)->postJson("/api/invoicing/invoices/{$invoiceId}/issue")->assertOk();
    $creditNoteId = $this->actingAs($owner)->postJson("/api/invoicing/invoices/{$invoiceId}/credit-notes", [
        'kind' => CreditNoteKind::Full->value,
        'reason' => CreditNoteReason::BillingError->value,
        'lines' => [],
    ])->assertCreated()->json('creditNote.id');
    $quoteId = quoteDraftFor($owner, $client);
    $path = str_replace(['{invoice}', '{creditNote}', '{quote}'], [$invoiceId, $creditNoteId, $quoteId], $route);

    $this->actingAs(issuableAccount())->json($method, $path)->assertNotFound();
})->with([
    'test an invoice e-mail' => ['POST', '/api/invoicing/invoices/{invoice}/email/test'],
    'set reminders' => ['PUT', '/api/invoicing/invoices/{invoice}/reminders'],
    'send a reminder' => ['POST', '/api/invoicing/invoices/{invoice}/reminders/send'],
    'preview a credit note' => ['POST', '/api/invoicing/invoices/{invoice}/credit-notes/paper'],
    'download a credit note' => ['GET', '/api/invoicing/credit-notes/{creditNote}/pdf'],
    'refund a credit note' => ['POST', '/api/invoicing/credit-notes/{creditNote}/refund'],
    'validate a quote' => ['POST', '/api/invoicing/quotes/{quote}/issue'],
    'accept a quote' => ['POST', '/api/invoicing/quotes/{quote}/accept'],
    'refuse a quote' => ['POST', '/api/invoicing/quotes/{quote}/refuse'],
    'reopen a quote' => ['POST', '/api/invoicing/quotes/{quote}/reopen'],
    'preview a quote e-mail' => ['POST', '/api/invoicing/quotes/{quote}/email/preview'],
    'e-mail a quote' => ['POST', '/api/invoicing/quotes/{quote}/email'],
    'test a quote e-mail' => ['POST', '/api/invoicing/quotes/{quote}/email/test'],
]);
