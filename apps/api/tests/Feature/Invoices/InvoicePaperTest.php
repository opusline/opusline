<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Settings\Enums\VatRegime;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    $this->travelTo('2026-08-10 12:00:00');
    Storage::fake('local');
});

function paperDraftPayload(Client $client, array $overrides = []): array
{
    return array_merge([
        'clientId' => $client->id,
        'issuedOn' => '2026-08-01',
        'paymentTermsDays' => 30,
        'paymentTermsEndOfMonth' => false,
        'showIban' => true,
        'showEmail' => true,
        'language' => DocumentLanguage::French->value,
        'lines' => [[
            'label' => 'Journée de développement frontend',
            'quantityMilli' => 19_000,
            'unit' => LineUnit::Day->value,
            'unitPrice' => ['amount' => 55_000, 'currency' => 'EUR'],
            'vatRateBp' => 2000,
        ]],
    ], $overrides);
}

test('prints a draft with the live identity under a draft stamp', function (): void {
    $user = issuableAccount();
    $id = draftFor($user, billableClient($user), ['title' => 'Juillet 2026']);

    $this->actingAs($user)
        ->getJson("/api/invoices/{$id}/paper")
        ->assertOk()
        ->assertJsonPath('title', 'Facture')
        ->assertJsonPath('stamp', 'Brouillon')
        ->assertJsonPath('seller.name', 'Théo Marchand EI')
        ->assertJsonPath('seller.lines', ['12 rue de Strasbourg', '44000 Nantes', 'SIRET : 123 456 782 00002', 'TVA intracom. : FR11123456782', 'theo@marchand.dev'])
        ->assertJsonPath('buyer.lines', ['3 impasse des Potiers', '44100 Nantes', 'SIREN : 123 456 782'])
        ->assertJsonPath('meta.0.value', '01/08/2026')
        ->assertJsonPath('meta.2.value', 'Juillet 2026')
        ->assertJsonPath('meta.3.value', 'Prestation de services')
        ->assertJsonPath('lines.0.quantity', '19 j')
        ->assertJsonPath('lines.0.unitPrice', "550,00\u{00A0}€")
        ->assertJsonPath('lines.0.total', "10\u{00A0}450,00\u{00A0}€")
        ->assertJsonPath('totals.2.value', "12\u{00A0}540,00\u{00A0}€")
        ->assertJsonPath('payment.2.value', 'attribuée à la validation');
});

test('writes the payment and penalty mentions the term calls for', function (array $overrides, string $expected): void {
    $user = issuableAccount();
    $id = draftFor($user, billableClient($user), $overrides);

    expect($this->actingAs($user)->getJson("/api/invoices/{$id}/paper")->json('legal'))->toContain($expected);
})->with([
    'on receipt' => [['paymentTermsDays' => 0], 'Paiement à réception.'],
    'end of month' => [['paymentTermsDays' => 0, 'paymentTermsEndOfMonth' => true], 'Paiement en fin de mois, au plus tard le 31/08/2026.'],
    '30 days end of month' => [['paymentTermsDays' => 30, 'paymentTermsEndOfMonth' => true], 'Paiement à 30 jours fin de mois, au plus tard le 30/09/2026.'],
    'stated rate' => [['latePenaltyRateBp' => 1240], 'pénalités au taux annuel de 12,4 %'],
    'statutory rate' => [['latePenaltyRateBp' => null], 'pénalités au taux de la BCE majoré de 10 points'],
    'fee and no discount' => [[], 'indemnité forfaitaire pour frais de recouvrement de 40 € (art. L441-10 du Code de commerce). Pas d\'escompte pour paiement anticipé.'],
    'custom mention' => [['customMentions' => 'Membre d\'une association agréée.'], 'Membre d\'une association agréée.'],
]);

test('prints the franchise mention and no VAT number under the franchise', function (): void {
    $user = issuableAccount();
    $user->settingsOrFail()->update(['vat_regime' => VatRegime::FranchiseEnBase, 'vat_number' => 'FR62123456782']);
    $id = draftFor($user, billableClient($user, ['vat_number' => 'FR11123456782']));

    $paper = $this->actingAs($user)->getJson("/api/invoices/{$id}/paper");

    expect($paper->json('legal'))->toContain('TVA non applicable, art. 293 B du CGI.')
        ->and($paper->json('seller.lines'))->not->toContain('TVA intracom. : FR62123456782')
        ->and($paper->json('buyer.lines'))->not->toContain('TVA intracom. : FR11123456782')
        ->and($paper->json('vatRows.0.rate'))->toBe('0 %');
});

test('prints the option for VAT on debits once the account took it', function (): void {
    $user = issuableAccount(['vat_on_debits' => true]);
    $id = draftFor($user, billableClient($user));

    expect($this->actingAs($user)->getJson("/api/invoices/{$id}/paper")->json('legal'))
        ->toContain('Option pour le paiement de la taxe d\'après les débits.');
});

test('prints the same invoice in English when asked', function (): void {
    $user = issuableAccount();
    $id = draftFor($user, billableClient($user));

    $this->actingAs($user)
        ->getJson("/api/invoices/{$id}/paper?language=".DocumentLanguage::English->value)
        ->assertJsonPath('title', 'Invoice')
        ->assertJsonPath('stamp', 'Draft')
        ->assertJsonPath('seller.lines.2', 'Registration no.: 123 456 782 00002')
        ->assertJsonPath('lines.0.quantity', '19 d')
        ->assertJsonPath('lines.0.unitPrice', '€550.00')
        ->assertJsonPath('head.total', 'Total excl. VAT');
});

test('prints an issued invoice from its snapshot, with its number', function (): void {
    $user = issuableAccount();
    $id = draftFor($user, billableClient($user));
    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue");
    $user->settingsOrFail()->update(['company_city' => 'Lyon']);

    $this->actingAs($user)
        ->getJson("/api/invoices/{$id}/paper")
        ->assertJsonPath('title', 'Facture n° 2026-001')
        ->assertJsonPath('stamp', null)
        ->assertJsonPath('seller.lines.1', '44000 Nantes')
        ->assertJsonPath('payment.2.value', '2026-001');
});

test('previews an editor draft that was never saved', function (): void {
    $user = issuableAccount();
    $client = billableClient($user);

    $this->actingAs($user)
        ->postJson('/api/invoicing/invoices/paper', [
            'clientId' => $client->id,
            'paymentTermsDays' => 30,
            'paymentTermsEndOfMonth' => false,
            'showIban' => false,
            'showEmail' => false,
            'language' => DocumentLanguage::French->value,
            'lines' => [[
                'label' => 'Atelier de cadrage',
                'quantityMilli' => 1000,
                'unit' => LineUnit::Flat->value,
                'unitPrice' => ['amount' => 30_000, 'currency' => 'EUR'],
                'vatRateBp' => 2000,
            ]],
        ])
        ->assertOk()
        ->assertJsonPath('lines.0.quantity', '1 forfait')
        ->assertJsonPath('totals.2.value', "360,00\u{00A0}€")
        ->assertJsonPath('paymentTitle', null);

    expect(Invoice::query()->count())->toBe(0);
});

test('downloads the PDF of an invoice', function (): void {
    $user = issuableAccount();
    $id = draftFor($user, billableClient($user));

    $response = $this->actingAs($user)->get("/api/invoices/{$id}/pdf")->assertOk();

    expect($response->headers->get('Content-Type'))->toBe('application/pdf')
        ->and($response->headers->get('Content-Disposition'))->toContain('Brouillon-facture.pdf')
        ->and($response->getContent())->toStartWith('%PDF-');
});

test('files the PDF among the client\'s documents when the invoice is issued', function (): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $id = draftFor($user, $client);

    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue")->assertOk();

    $invoice = Invoice::query()->findOrFail($id);
    $document = $invoice->attachedDocument();
    expect($document)->not->toBeNull()
        ->and($document?->file_name)->toBe('Facture-2026-001.pdf')
        ->and($document?->getCustomProperty('category'))->toBe(DocumentCategory::IssuedInvoice->value);
    $this->actingAs($user)->getJson("/api/invoices/{$id}")->assertJsonPath('document.fileName', 'Facture-2026-001.pdf');
});

test('has no sheet for an invoice recorded from another tool', function (): void {
    $user = issuableAccount();
    $recorded = Invoice::factory()->for($user)->for(billableClient($user))->create();

    $this->actingAs($user)->getJson("/api/invoices/{$recorded->id}/paper")->assertNotFound();
    $this->actingAs($user)->get("/api/invoices/{$recorded->id}/pdf")->assertNotFound();
});

test('downloads the copy filed at issue, whatever the settings became since', function (): void {
    $user = issuableAccount();
    $this->actingAs($user)->post('/api/user/logo', ['logo' => UploadedFile::fake()->image('logo.png')])->assertNoContent();
    $id = draftFor($user, billableClient($user));
    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue")->assertOk();
    $filed = $this->actingAs($user)->get("/api/invoices/{$id}/pdf")->assertOk()->streamedContent();

    $this->actingAs($user)->deleteJson('/api/user/logo')->assertNoContent();
    $user->settingsOrFail()->update(['company_city' => 'Lyon']);

    $response = $this->actingAs($user)->get("/api/invoices/{$id}/pdf")->assertOk();
    $document = Invoice::query()->findOrFail($id)->attachedDocument();
    expect($response->streamedContent())->toBe($filed)
        ->and($filed)->toBe(Storage::disk($document?->disk ?? 'local')->get((string) $document?->getPathRelativeToRoot()))
        ->and($response->headers->get('Content-Disposition'))->toContain('Facture-2026-001.pdf');
});

test('keeps another account\'s sheet, PDF and clients out of reach', function (): void {
    $owner = issuableAccount();
    $ownerClient = billableClient($owner);
    $id = draftFor($owner, $ownerClient);
    $user = issuableAccount();

    $this->actingAs($user)->getJson("/api/invoices/{$id}/paper")->assertNotFound();
    $this->actingAs($user)->get("/api/invoices/{$id}/pdf")->assertNotFound();
    $this->actingAs($user)
        ->postJson('/api/invoicing/invoices/paper', paperDraftPayload($ownerClient))
        ->assertNotFound();
});

test('refuses a language it does not print in, and a preview it cannot price', function (): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $id = draftFor($user, $client);

    $this->actingAs($user)->getJson("/api/invoices/{$id}/paper?language=9")->assertJsonValidationErrorFor('language');
    $this->actingAs($user)->get("/api/invoices/{$id}/pdf?language=9")->assertUnprocessable();
    $this->actingAs($user)
        ->postJson('/api/invoicing/invoices/paper', paperDraftPayload($client, ['lines' => [['label' => 'Atelier']]]))
        ->assertJsonValidationErrorFor('lines.0.quantityMilli');
});
