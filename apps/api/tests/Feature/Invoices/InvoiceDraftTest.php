<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Actions\SaveInvoiceDraft;
use App\Domain\Invoices\Data\SaveInvoiceDraftData;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\InvoiceSource;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Models\Mission;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Users\Models\User;
use Symfony\Component\HttpKernel\Exception\HttpException;

function draftLine(array $overrides = []): array
{
    return array_merge([
        'label' => 'Développement des écrans compte et commandes',
        'quantityMilli' => 6000,
        'unit' => LineUnit::Day->value,
        'unitPrice' => ['amount' => 48_000, 'currency' => 'EUR'],
        'vatRateBp' => 2000,
        'detail' => null,
    ], $overrides);
}

function draftPayload(Client $client, array $overrides = []): array
{
    return array_merge([
        'clientId' => $client->id,
        'title' => "Refonte de l'espace client",
        'issuedOn' => '2026-08-10',
        'paymentTermsDays' => 30,
        'paymentTermsEndOfMonth' => true,
        'showIban' => true,
        'showEmail' => false,
        'language' => DocumentLanguage::French->value,
        'lines' => [
            draftLine(['label' => 'Atelier de cadrage', 'quantityMilli' => 1000, 'unit' => LineUnit::Flat->value, 'unitPrice' => ['amount' => 30_000, 'currency' => 'EUR']]),
            draftLine(),
        ],
    ], $overrides);
}

test('drafts an invoice from its lines and stores their totals on the header', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();

    $response = $this->actingAs($user)
        ->postJson('/api/invoicing/invoices', draftPayload($client))
        ->assertCreated()
        ->assertJsonPath('invoice.source', InvoiceSource::Opusline->value)
        ->assertJsonPath('invoice.status', InvoiceStatus::Draft->value)
        ->assertJsonPath('invoice.number', null)
        ->assertJsonPath('invoice.amountHt.amount', 318_000)
        ->assertJsonPath('invoice.amountVat.amount', 63_600)
        ->assertJsonPath('invoice.amountTtc.amount', 381_600)
        ->assertJsonPath('invoice.vatRateBp', 2000)
        // 30 days end of month from 10 August: 31 August + 30 days.
        ->assertJsonPath('invoice.dueOn', '2026-09-30')
        ->assertJsonPath('content.title', "Refonte de l'espace client")
        ->assertJsonPath('content.paymentTermsEndOfMonth', true)
        ->assertJsonCount(2, 'content.lines')
        ->assertJsonPath('content.lines.0.label', 'Atelier de cadrage')
        ->assertJsonPath('content.lines.1.totalHt.amount', 288_000)
        ->assertJsonPath('content.vatBreakdown.0.rateBp', 2000)
        ->assertJsonPath('content.vatBreakdown.0.base.amount', 318_000);

    expect(Invoice::query()->findOrFail($response->json('invoice.id'))->events()->count())->toBe(1);
});

test('carries no VAT under the franchise, whatever rate the lines asked for', function (): void {
    $user = User::factory()->create();
    $user->settingsOrFail()->update(['vat_regime' => VatRegime::FranchiseEnBase]);
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/invoicing/invoices', draftPayload($client))
        ->assertCreated()
        ->assertJsonPath('invoice.amountTtc.amount', 318_000)
        ->assertJsonPath('content.lines.0.vatRateBp', 0)
        ->assertJsonPath('content.vatBreakdown.0.rateBp', 0);
});

test('replaces the lines on every save of the draft', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();
    $id = $this->actingAs($user)->postJson('/api/invoicing/invoices', draftPayload($client))->json('invoice.id');

    $this->actingAs($user)
        ->putJson("/api/invoicing/invoices/{$id}", draftPayload($client, ['lines' => [
            draftLine(['quantityMilli' => 500, 'unit' => LineUnit::Day->value, 'unitPrice' => ['amount' => 55_000, 'currency' => 'EUR'], 'vatRateBp' => 1000]),
        ]]))
        ->assertOk()
        ->assertJsonCount(1, 'content.lines')
        ->assertJsonPath('invoice.amountHt.amount', 27_500)
        ->assertJsonPath('invoice.amountTtc.amount', 30_250);
});

test('lets a deduction line lower the total', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/invoicing/invoices', draftPayload($client, ['lines' => [
            draftLine(),
            draftLine(['label' => "Déduction de l'avoir A-2026-001", 'quantityMilli' => 1000, 'unit' => LineUnit::Flat->value, 'unitPrice' => ['amount' => -8_500, 'currency' => 'EUR']]),
        ]]))
        ->assertCreated()
        ->assertJsonPath('invoice.amountHt.amount', 279_500);
});

test('keeps an issued or recorded invoice out of the draft editor', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();
    $recorded = Invoice::factory()->for($user)->for($client)->create();

    $this->actingAs($user)
        ->putJson("/api/invoicing/invoices/{$recorded->id}", draftPayload($client))
        ->assertConflict();
});

test('keeps the recording endpoints off an invoice written in Opusline', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();
    $id = $this->actingAs($user)->postJson('/api/invoicing/invoices', draftPayload($client))->json('invoice.id');

    $this->actingAs($user)
        ->putJson("/api/invoices/{$id}", ['clientId' => $client->id, 'amountHt' => ['amount' => 100, 'currency' => 'EUR']])
        ->assertConflict();
    $this->actingAs($user)
        ->postJson("/api/invoices/{$id}/send", ['number' => 'F-2026-001'])
        ->assertConflict();
});

test('refuses a mission of another client', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();
    $otherMission = Mission::factory()->for($user)->for(Client::factory()->for($user))->create();

    $this->actingAs($user)
        ->postJson('/api/invoicing/invoices', draftPayload($client, ['missionId' => $otherMission->id]))
        ->assertJsonValidationErrorFor('missionId');
});

test('refuses another account\'s client and draft', function (): void {
    $user = vatLiableUser();
    $foreignClient = Client::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/invoicing/invoices', draftPayload($foreignClient))
        ->assertNotFound();
});

test('refuses lines it cannot price, on a new or saved draft', function (string $method, array $line, string $field): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();
    $id = $this->actingAs($user)->postJson('/api/invoicing/invoices', draftPayload($client))->json('invoice.id');
    $url = $method === 'PUT' ? "/api/invoicing/invoices/{$id}" : '/api/invoicing/invoices';

    $this->actingAs($user)
        ->json($method, $url, draftPayload($client, ['lines' => [draftLine($line)]]))
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor("lines.0.{$field}");

    expect(Invoice::query()->findOrFail($id)->lines()->count())->toBe(2);
})->with(['POST', 'PUT'])->with([
    'no quantity' => [['quantityMilli' => 0], 'quantityMilli'],
    'unknown unit' => [['unit' => 9], 'unit'],
    'foreign currency' => [['unitPrice' => ['amount' => 100, 'currency' => 'USD']], 'unitPrice.currency'],
    'rate above 100 %' => [['vatRateBp' => 10_001], 'vatRateBp'],
]);

test('refuses lines that add up to a negative total', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/invoicing/invoices', draftPayload($client, ['lines' => [
            draftLine(['quantityMilli' => 1000, 'unit' => LineUnit::Flat->value, 'unitPrice' => ['amount' => 30_000, 'currency' => 'EUR']]),
            draftLine(['label' => "Déduction de l'avoir A-2026-001", 'quantityMilli' => 1000, 'unit' => LineUnit::Flat->value, 'unitPrice' => ['amount' => -40_000, 'currency' => 'EUR']]),
        ]]))
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('lines');

    expect(Invoice::query()->count())->toBe(0);
});

test('keeps another account\'s draft out of reach on update', function (): void {
    $owner = vatLiableUser();
    $ownerClient = Client::factory()->for($owner)->create();
    $id = $this->actingAs($owner)->postJson('/api/invoicing/invoices', draftPayload($ownerClient))->json('invoice.id');
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->putJson("/api/invoicing/invoices/{$id}", draftPayload($client, ['title' => 'Détournée', 'lines' => [draftLine()]]))
        ->assertNotFound();

    $draft = Invoice::query()->findOrFail($id);
    expect($draft->title)->toBe("Refonte de l'espace client")
        ->and($draft->lines()->count())->toBe(2);
});

test('caps the payment term at the legal maximum', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/invoicing/invoices', draftPayload($client, ['paymentTermsDays' => 46, 'paymentTermsEndOfMonth' => true]))
        ->assertJsonValidationErrorFor('paymentTermsDays');
});

test('a save that loaded the draft before it was issued leaves the issued invoice alone', function (): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $id = draftFor($user, $client);
    $loadedBeforeIssue = Invoice::query()->findOrFail($id);
    $this->actingAs($user)->postJson("/api/invoicing/invoices/{$id}/issue")->assertOk();

    expect(fn () => app(SaveInvoiceDraft::class)->handle(
        $user,
        SaveInvoiceDraftData::from(draftPayloadFor($client, ['lines' => [
            ['label' => 'Rewritten', 'quantityMilli' => 1_000, 'unit' => LineUnit::Flat->value, 'unitPrice' => ['amount' => 1, 'currency' => 'EUR'], 'vatRateBp' => 0],
        ]])),
        $loadedBeforeIssue,
    ))->toThrow(HttpException::class);

    expect($loadedBeforeIssue->refresh()->lines->pluck('label')->all())->not->toContain('Rewritten');
});
