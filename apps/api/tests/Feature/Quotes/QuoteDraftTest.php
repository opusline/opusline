<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Missions\Models\Mission;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Users\Models\User;

beforeEach(function (): void {
    $this->travelTo('2026-08-10 12:00:00');
});

test('drafts a quote from its lines, with its validity and its deposit', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();

    $response = $this->actingAs($user)
        ->postJson('/api/invoicing/quotes', quotePayloadFor($client, ['lines' => [
            ['label' => 'Atelier de cadrage', 'quantityMilli' => 1000, 'unit' => LineUnit::Flat->value, 'unitPrice' => ['amount' => 30_000, 'currency' => 'EUR'], 'vatRateBp' => 2000],
            ['label' => 'Développement', 'quantityMilli' => 6000, 'unit' => LineUnit::Day->value, 'unitPrice' => ['amount' => 48_000, 'currency' => 'EUR'], 'vatRateBp' => 2000],
        ]]))
        ->assertCreated()
        ->assertJsonPath('quote.status', QuoteStatus::Draft->value)
        ->assertJsonPath('quote.number', null)
        ->assertJsonPath('quote.isExpired', false)
        ->assertJsonPath('quote.amountHt.amount', 318_000)
        ->assertJsonPath('quote.amountVat.amount', 63_600)
        ->assertJsonPath('quote.amountTtc.amount', 381_600)
        ->assertJsonPath('quote.validityDays', 30)
        ->assertJsonPath('quote.validUntil', '2026-08-31')
        ->assertJsonPath('quote.depositRateBp', 3000)
        ->assertJsonPath('quote.depositAmount.amount', 114_480)
        ->assertJsonPath('content.paymentTermsDays', 30)
        ->assertJsonCount(2, 'content.lines')
        ->assertJsonPath('content.lines.1.totalHt.amount', 288_000)
        ->assertJsonPath('content.vatBreakdown.0.base.amount', 318_000)
        ->assertJsonPath('content.seller', null);

    expect(Quote::query()->findOrFail($response->json('quote.id'))->lines()->count())->toBe(2);
});

test('asks no deposit unless the draft names one', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/invoicing/quotes', quotePayloadFor($client, ['depositRateBp' => null]))
        ->assertCreated()
        ->assertJsonPath('quote.depositRateBp', null)
        ->assertJsonPath('quote.depositAmount', null);
});

test('carries no VAT under the franchise, whatever rate the lines asked for', function (): void {
    $user = User::factory()->create();
    $user->settingsOrFail()->update(['vat_regime' => VatRegime::FranchiseEnBase]);
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/invoicing/quotes', quotePayloadFor($client))
        ->assertCreated()
        ->assertJsonPath('quote.amountTtc.amount', 1_045_000)
        ->assertJsonPath('quote.vatRateBp', 0)
        ->assertJsonPath('content.lines.0.vatRateBp', 0);
});

test('replaces the lines wholesale on every save', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();
    $id = quoteDraftFor($user, $client);

    $this->actingAs($user)
        ->putJson("/api/invoicing/quotes/{$id}", quotePayloadFor($client, [
            'title' => 'Phase 2',
            'validityDays' => 15,
            'lines' => [['label' => 'Maintenance', 'quantityMilli' => 2000, 'unit' => LineUnit::Day->value, 'unitPrice' => ['amount' => 50_000, 'currency' => 'EUR'], 'vatRateBp' => 2000]],
        ]))
        ->assertOk()
        ->assertJsonPath('quote.title', 'Phase 2')
        ->assertJsonPath('quote.validUntil', '2026-08-16')
        ->assertJsonPath('quote.amountHt.amount', 100_000)
        ->assertJsonCount(1, 'content.lines');

    expect(Quote::query()->findOrFail($id)->lines()->count())->toBe(1);
});

test('refuses a mission that is not the client\'s', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();
    $other = Mission::factory()->for(Client::factory()->for($user))->create();

    $this->actingAs($user)
        ->postJson('/api/invoicing/quotes', quotePayloadFor($client, ['missionId' => $other->id]))
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor('missionId');
});

test('refuses what the editor cannot send', function (array $overrides, string $field): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/invoicing/quotes', quotePayloadFor($client, $overrides))
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor($field);
})->with([
    'no validity' => [['validityDays' => 0], 'validityDays'],
    'a year and more' => [['validityDays' => 366], 'validityDays'],
    'a deposit over the total' => [['depositRateBp' => 10_001], 'depositRateBp'],
    'a term past the legal cap' => [['paymentTermsDays' => 61], 'paymentTermsDays'],
    'a line without a label' => [['lines' => [['quantityMilli' => 1000, 'unit' => LineUnit::Day->value, 'unitPrice' => ['amount' => 1000, 'currency' => 'EUR'], 'vatRateBp' => 2000]]], 'lines.0.label'],
    'a negative total' => [['lines' => [['label' => 'Remise', 'quantityMilli' => 1000, 'unit' => LineUnit::Flat->value, 'unitPrice' => ['amount' => -1000, 'currency' => 'EUR'], 'vatRateBp' => 2000]]], 'lines'],
]);

test('deletes a draft and nothing else', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();
    $draft = quoteDraftFor($user, $client);
    $sent = Quote::factory()->for($user)->for($client)->sent()->create();

    $this->actingAs($user)->deleteJson("/api/invoicing/quotes/{$draft}")->assertNoContent();
    $this->actingAs($user)->deleteJson("/api/invoicing/quotes/{$sent->id}")->assertConflict();

    expect(Quote::query()->find($draft))->toBeNull()
        ->and(Quote::query()->find($sent->id))->not->toBeNull();
});

test('freezes a sent quote against the editor', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();
    $sent = Quote::factory()->for($user)->for($client)->sent()->create();

    $this->actingAs($user)
        ->putJson("/api/invoicing/quotes/{$sent->id}", quotePayloadFor($client))
        ->assertConflict()
        ->assertJsonPath('message', __('quotes.not_a_draft'));
});

test('keeps a client or a mission with quotes from being deleted', function (): void {
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client)->create();
    quoteDraftFor($user, $client, ['missionId' => $mission->id]);

    $this->actingAs($user)->deleteJson("/api/clients/{$client->slug}/missions/{$mission->slug}")->assertConflict();
    $this->actingAs($user)->deleteJson("/api/clients/{$client->slug}")->assertConflict();
});

test('keeps another account\'s quote out of reach', function (): void {
    $owner = vatLiableUser();
    $other = vatLiableUser();
    $id = quoteDraftFor($owner, Client::factory()->for($owner)->create());

    $this->actingAs($other)->getJson("/api/invoicing/quotes/{$id}")->assertNotFound();
    $this->actingAs($other)->putJson("/api/invoicing/quotes/{$id}", quotePayloadFor(Client::factory()->for($other)->create()))->assertNotFound();
    $this->actingAs($other)->deleteJson("/api/invoicing/quotes/{$id}")->assertNotFound();
    $this->actingAs($other)->getJson("/api/invoicing/quotes/{$id}/paper")->assertNotFound();
});

test('hides behind the invoicing flag', function (): void {
    invoicingReleasedAs('off');
    $user = vatLiableUser();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)->getJson('/api/invoicing/quotes')->assertNotFound();
    $this->actingAs($user)->postJson('/api/invoicing/quotes', quotePayloadFor($client))->assertNotFound();
});
