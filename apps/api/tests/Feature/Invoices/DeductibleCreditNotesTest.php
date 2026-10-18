<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\CreditNoteKind;
use App\Domain\Invoices\Enums\CreditNoteReason;
use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Users\Models\User;

beforeEach(function (): void {
    $this->travelTo('2026-08-10 12:00:00');
});

/** A paid invoice whose client is owed 120 € back on its next invoice: the client's id. */
function clientOwedADeduction(User $user): int
{
    $client = billableClient($user);
    $id = draftFor($user, $client);
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue")->assertOk();
    test()->actingAs($user)->postJson("/api/invoices/{$id}/pay", ['paidOn' => '2026-08-10'])->assertOk();
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/credit-notes", [
        'kind' => CreditNoteKind::Partial->value,
        'reason' => CreditNoteReason::CommercialGesture->value,
        'lines' => [[
            'label' => 'Geste commercial',
            'quantityMilli' => 1000,
            'unit' => LineUnit::Flat->value,
            'unitPrice' => ['amount' => 10_000, 'currency' => 'EUR'],
            'vatRateBp' => 2000,
        ]],
        'settlement' => CreditNoteSettlement::DeductFromNextInvoice->value,
    ])->assertCreated();

    return $client->id;
}

test('offers a stranger none of another account\'s credit notes, even with its client id', function (): void {
    $clientId = clientOwedADeduction(issuableAccount());

    $this->actingAs(issuableAccount())
        ->getJson("/api/invoicing/credit-notes/deductible?clientId={$clientId}")
        ->assertOk()
        ->assertJsonCount(0, 'creditNotes');
});

test('asks which client the credit notes are for', function (): void {
    $this->actingAs(issuableAccount())
        ->getJson('/api/invoicing/credit-notes/deductible')
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('clientId');
});
