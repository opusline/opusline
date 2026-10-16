<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Settings\Enums\VatRegime;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    $this->travelTo('2026-08-10 12:00:00');
    Storage::fake('local');
});

test('prints a draft quote with its validity, its deposit and the signature box', function (): void {
    $user = issuableAccount();
    $id = quoteDraftFor($user, billableClient($user));

    $this->actingAs($user)
        ->getJson("/api/invoicing/quotes/{$id}/paper")
        ->assertOk()
        ->assertJsonPath('title', 'Devis')
        ->assertJsonPath('stamp', 'Brouillon')
        ->assertJsonPath('meta.0.label', 'Émise le')
        ->assertJsonPath('meta.0.value', '01/08/2026')
        ->assertJsonPath('meta.1.label', 'Valable jusqu\'au')
        ->assertJsonPath('meta.1.value', '31/08/2026')
        ->assertJsonPath('meta.2.value', "Refonte de l'espace client")
        ->assertJsonCount(3, 'meta')
        ->assertJsonPath('totals.2.value', "12\u{00A0}540,00\u{00A0}€")
        ->assertJsonPath('totals.3.label', 'Acompte à l\'acceptation (30 %)')
        ->assertJsonPath('totals.3.value', "3\u{00A0}762,00\u{00A0}€")
        ->assertJsonPath('paymentTitle', null)
        ->assertJsonPath('legal', 'Devis valable jusqu\'au 31/08/2026. Un acompte de 30 % du total TTC est dû à l\'acceptation. Factures payables à 30 jours.')
        ->assertJsonPath('signature.title', 'Bon pour accord')
        ->assertJsonPath('footer', 'Devis');
});

test('prints the same quote in English when asked', function (): void {
    $user = issuableAccount();
    $id = quoteDraftFor($user, billableClient($user), ['depositRateBp' => null, 'paymentTermsDays' => 0]);

    $this->actingAs($user)
        ->getJson("/api/invoicing/quotes/{$id}/paper?language=".DocumentLanguage::English->value)
        ->assertOk()
        ->assertJsonPath('title', 'Quote')
        ->assertJsonPath('meta.1.label', 'Valid until')
        ->assertJsonCount(3, 'totals')
        ->assertJsonPath('legal', 'This quote is valid until 31/08/2026. Invoices are payable on receipt.')
        ->assertJsonPath('signature.title', 'Accepted and agreed');
});

test('prints the franchise mention under the franchise', function (): void {
    $user = issuableAccount(['vat_regime' => VatRegime::FranchiseEnBase, 'vat_number' => null]);
    $id = quoteDraftFor($user, billableClient($user));

    $this->actingAs($user)
        ->getJson("/api/invoicing/quotes/{$id}/paper")
        ->assertJsonPath('legal', 'Devis valable jusqu\'au 31/08/2026. Un acompte de 30 % du total TTC est dû à l\'acceptation. Factures payables à 30 jours. TVA non applicable, art. 293 B du CGI.');
});

test('prints a sent quote from its snapshot, with its number', function (): void {
    $user = issuableAccount();
    $id = quoteDraftFor($user, billableClient($user));
    $this->actingAs($user)->postJson("/api/invoicing/quotes/{$id}/issue")->assertOk();
    $user->settingsOrFail()->update(['company_city' => 'Lyon']);

    $this->actingAs($user)
        ->getJson("/api/invoicing/quotes/{$id}/paper")
        ->assertJsonPath('title', 'Devis n° D-2026-001')
        ->assertJsonPath('stamp', null)
        ->assertJsonPath('meta.1.value', '09/09/2026')
        ->assertJsonPath('seller.lines.1', '44000 Nantes')
        ->assertJsonPath('footer', 'D-2026-001');
});

test('previews an editor draft that was never saved', function (): void {
    $user = issuableAccount();

    $this->actingAs($user)
        ->postJson('/api/invoicing/quotes/paper', quotePayloadFor(billableClient($user), ['validityDays' => 10]))
        ->assertOk()
        ->assertJsonPath('title', 'Devis')
        ->assertJsonPath('meta.1.value', '11/08/2026')
        ->assertJsonPath('signature.title', 'Bon pour accord');
});

test('downloads the PDF of a quote, the filed copy once it is sent', function (): void {
    $user = issuableAccount();
    $id = quoteDraftFor($user, billableClient($user));

    $draft = $this->actingAs($user)->get("/api/invoicing/quotes/{$id}/pdf")->assertOk();
    expect($draft->headers->get('Content-Type'))->toBe('application/pdf')
        ->and($draft->headers->get('Content-Disposition'))->toContain('Brouillon-devis.pdf')
        ->and($draft->getContent())->toStartWith('%PDF-');

    $this->actingAs($user)->postJson("/api/invoicing/quotes/{$id}/issue")->assertOk();
    $filed = $this->actingAs($user)->get("/api/invoicing/quotes/{$id}/pdf")->assertOk()->streamedContent();
    $document = Quote::query()->findOrFail($id)->attachedDocument();
    expect($filed)->toBe(Storage::disk($document?->disk ?? 'local')->get((string) $document?->getPathRelativeToRoot()));
});

test('ends an invoice with no signature box', function (): void {
    $user = issuableAccount();
    $id = draftFor($user, billableClient($user));

    $this->actingAs($user)->getJson("/api/invoices/{$id}/paper")->assertJsonPath('signature', null);
});
