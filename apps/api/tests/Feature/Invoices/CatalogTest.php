<?php

declare(strict_types=1);

use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Models\CatalogItem;
use App\Domain\Users\Models\User;

function catalogPayload(array $overrides = []): array
{
    return array_merge([
        'label' => 'Atelier de cadrage',
        'detail' => "Demi-journée avec l'équipe produit, compte rendu inclus",
        'unit' => LineUnit::Flat->value,
        'unitPrice' => ['amount' => 30_000, 'currency' => 'EUR'],
        'vatRateBp' => 2000,
    ], $overrides);
}

test('adds a service to the catalogue', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/invoicing/catalog', catalogPayload(['label' => '  Atelier de cadrage  ']))
        ->assertCreated()
        ->assertJsonPath('label', 'Atelier de cadrage')
        ->assertJsonPath('unit', LineUnit::Flat->value)
        ->assertJsonPath('unitPrice.amount', 30_000)
        ->assertJsonPath('vatRateBp', 2000);

    expect($user->catalogItems()->count())->toBe(1);
});

test('lists the catalogue alphabetically', function (): void {
    $user = User::factory()->create();
    CatalogItem::factory()->for($user)->create(['label' => 'Recette et mise en ligne']);
    CatalogItem::factory()->for($user)->create(['label' => 'Heure de maintenance']);
    CatalogItem::factory()->create(['label' => 'Someone else\'s']);

    $this->actingAs($user)
        ->getJson('/api/invoicing/catalog')
        ->assertOk()
        ->assertJsonCount(2, 'items')
        ->assertJsonPath('items.0.label', 'Heure de maintenance')
        ->assertJsonPath('items.1.label', 'Recette et mise en ligne');
});

test('updates a service', function (): void {
    $user = User::factory()->create();
    $item = CatalogItem::factory()->for($user)->create();

    $this->actingAs($user)
        ->putJson("/api/invoicing/catalog/{$item->id}", catalogPayload([
            'unit' => LineUnit::Hour->value,
            'unitPrice' => ['amount' => 8_500, 'currency' => 'EUR'],
            'detail' => '   ',
        ]))
        ->assertOk()
        ->assertJsonPath('unit', LineUnit::Hour->value)
        ->assertJsonPath('unitPrice.amount', 8_500)
        ->assertJsonPath('detail', null);
});

test('removes a service', function (): void {
    $user = User::factory()->create();
    $item = CatalogItem::factory()->for($user)->create();

    $this->actingAs($user)->deleteJson("/api/invoicing/catalog/{$item->id}")->assertNoContent();

    expect(CatalogItem::query()->count())->toBe(0);
});

test('keeps another account\'s services out of reach', function (string $method): void {
    $item = CatalogItem::factory()->create();

    $this->actingAs(User::factory()->create())
        ->json($method, "/api/invoicing/catalog/{$item->id}", catalogPayload())
        ->assertNotFound();
})->with(['PUT', 'DELETE']);

test('refuses a price in another currency than the account\'s', function (): void {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/invoicing/catalog', catalogPayload(['unitPrice' => ['amount' => 30_000, 'currency' => 'USD']]))
        ->assertJsonValidationErrorFor('unitPrice.currency');
});

test('refuses an incomplete service, new or edited', function (string $method, array $overrides, string $field): void {
    $user = User::factory()->create();
    $item = CatalogItem::factory()->for($user)->create(['label' => 'Heure de maintenance']);
    $url = $method === 'PUT' ? "/api/invoicing/catalog/{$item->id}" : '/api/invoicing/catalog';

    $this->actingAs($user)
        ->json($method, $url, catalogPayload($overrides))
        ->assertUnprocessable()
        ->assertJsonValidationErrorFor($field);

    expect($user->catalogItems()->count())->toBe(1)
        ->and($item->fresh()?->label)->toBe('Heure de maintenance');
})->with(['POST', 'PUT'])->with([
    'no label' => [['label' => ''], 'label'],
    'free' => [['unitPrice' => ['amount' => 0, 'currency' => 'EUR']], 'unitPrice.amount'],
    'unknown unit' => [['unit' => 9], 'unit'],
    'rate above 100 %' => [['vatRateBp' => 10_001], 'vatRateBp'],
]);
