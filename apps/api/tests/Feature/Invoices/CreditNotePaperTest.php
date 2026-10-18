<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\CreditNoteKind;
use App\Domain\Invoices\Enums\CreditNoteReason;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    $this->travelTo('2026-08-10 12:00:00');
    Storage::fake('local');
});

/** A full credit note on an issued invoice of the account: its id. */
function creditNoteOf(User $user): int
{
    $id = draftFor($user, billableClient($user));
    test()->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue")->assertOk();

    return test()->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/credit-notes", [
        'kind' => CreditNoteKind::Full->value,
        'reason' => CreditNoteReason::BillingError->value,
        'lines' => [],
    ])->assertCreated()->json('creditNote.id');
}

test('prints a credit note in English when asked', function (): void {
    $user = issuableAccount();
    $id = creditNoteOf($user);

    $this->actingAs($user)
        ->getJson("/api/invoicing/credit-notes/{$id}/paper?language=".DocumentLanguage::English->value)
        ->assertOk()
        ->assertJsonPath('language', DocumentLanguage::English->value)
        ->assertJsonPath('head.total', 'Total excl. VAT')
        ->assertJsonPath('lines.0.unitPrice', '€550.00');
});

test('downloads a credit note in English under an English file name', function (): void {
    $user = issuableAccount();
    $id = creditNoteOf($user);

    $this->actingAs($user)
        ->get("/api/invoicing/credit-notes/{$id}/pdf?language=".DocumentLanguage::English->value)
        ->assertOk()
        ->assertHeader('Content-Disposition', 'attachment; filename="Credit-note-A-2026-001.pdf"');
});

test('prints the franchise mention on a credit note under the franchise', function (): void {
    $user = issuableAccount();
    $user->settingsOrFail()->update(['vat_regime' => VatRegime::FranchiseEnBase]);
    $id = creditNoteOf($user);

    expect($this->actingAs($user)->getJson("/api/invoicing/credit-notes/{$id}/paper")->json('legal'))
        ->toContain('TVA non applicable, art. 293 B du CGI.');
});
