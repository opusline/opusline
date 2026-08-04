<?php

declare(strict_types=1);

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Shared\Enums\Color;
use App\Domain\Users\Models\User;

test('creates a client', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/clients', [
            'name' => 'Nordlys',
            'type' => ClientType::Intermediary->value,
            'notes' => 'ESN — contact Julie',
        ])
        ->assertCreated()
        ->assertJsonPath('name', 'Nordlys')
        ->assertJsonPath('type', ClientType::Intermediary->value)
        ->assertJsonPath('notes', 'ESN — contact Julie')
        ->assertJsonPath('archivedAt', null);

    $this->assertDatabaseHas('clients', [
        'name' => 'Nordlys',
        'type' => ClientType::Intermediary->value,
        'user_id' => $user->id,
    ]);
});

test('creates a client with billing details', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/clients', [
            'name' => 'Nordlys',
            'type' => ClientType::Direct->value,
            'siret' => '123 456 789 00012',
            'vatNumber' => 'FR62 892447118',
            'billingAddress' => "12 rue de la Paix\n44000 Nantes",
            'billingContactName' => 'Camille Dupont',
            'billingEmail' => 'factures@nordlys.example',
            'color' => Color::Sage->value,
            'paymentTermsDays' => 60,
        ])
        ->assertCreated()
        ->assertJsonPath('siret', '123 456 789 00012')
        ->assertJsonPath('vatNumber', 'FR62 892447118')
        ->assertJsonPath('billingAddress', "12 rue de la Paix\n44000 Nantes")
        ->assertJsonPath('billingContactName', 'Camille Dupont')
        ->assertJsonPath('billingEmail', 'factures@nordlys.example')
        ->assertJsonPath('color', Color::Sage->value)
        ->assertJsonPath('paymentTermsDays', 60);

    $this->assertDatabaseHas('clients', [
        'name' => 'Nordlys',
        'siret' => '123 456 789 00012',
        'billing_email' => 'factures@nordlys.example',
        'color' => Color::Sage->value,
        'payment_terms_days' => 60,
    ]);
});

test('defaults the color to amber and the payment terms to 45 days', function (): void {
    $response = $this->actingAs(User::factory()->create())
        ->postJson('/api/clients', ['name' => 'Nordlys', 'type' => ClientType::Direct->value])
        ->assertCreated()
        ->assertJsonPath('color', Color::Amber->value)
        ->assertJsonPath('paymentTermsDays', 45);

    expect($response->json('createdAt'))->not->toBeNull();
});

test('generates a slug from the name', function (): void {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/clients', ['name' => 'Studio Lorem', 'type' => ClientType::Direct->value])
        ->assertCreated()
        ->assertJsonPath('slug', 'studio-lorem');
});

test('suffixes the slug when it is already taken by a different name', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/clients', ['name' => 'Nordlys', 'type' => ClientType::Direct->value])
        ->assertCreated();

    $this->actingAs($user)
        ->postJson('/api/clients', ['name' => 'Nordlys!', 'type' => ClientType::Direct->value])
        ->assertCreated()
        ->assertJsonPath('slug', 'nordlys-1');
});

test('rejects a name already used by the same user', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/clients', ['name' => 'Nordlys', 'type' => ClientType::Direct->value])
        ->assertCreated();

    $this->actingAs($user)
        ->postJson('/api/clients', ['name' => 'Nordlys', 'type' => ClientType::Direct->value])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

test('reuses the same slug across different users', function (): void {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/clients', ['name' => 'Nordlys', 'type' => ClientType::Direct->value])
        ->assertJsonPath('slug', 'nordlys');

    $this->actingAs(User::factory()->create())
        ->postJson('/api/clients', ['name' => 'Nordlys', 'type' => ClientType::Direct->value])
        ->assertJsonPath('slug', 'nordlys');
});

test('rejects an invalid payload', function (array $payload, string $expectedError): void {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/clients', $payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$expectedError]);
})->with([
    'missing name' => [['type' => ClientType::Direct->value], 'name'],
    'empty name' => [['name' => '', 'type' => ClientType::Direct->value], 'name'],
    'name too long' => [['name' => str_repeat('a', 256), 'type' => ClientType::Direct->value], 'name'],
    'missing type' => [['name' => 'Nordlys'], 'type'],
    'unknown type' => [['name' => 'Nordlys', 'type' => 99], 'type'],
    'unknown color' => [['name' => 'Nordlys', 'type' => ClientType::Direct->value, 'color' => 99], 'color'],
    'malformed billing email' => [['name' => 'Nordlys', 'type' => ClientType::Direct->value, 'billingEmail' => 'not-an-email'], 'billingEmail'],
    'negative payment terms' => [['name' => 'Nordlys', 'type' => ClientType::Direct->value, 'paymentTermsDays' => -1], 'paymentTermsDays'],
    'payment terms above a year' => [['name' => 'Nordlys', 'type' => ClientType::Direct->value, 'paymentTermsDays' => 400], 'paymentTermsDays'],
    'non integer payment terms' => [['name' => 'Nordlys', 'type' => ClientType::Direct->value, 'paymentTermsDays' => 'soon'], 'paymentTermsDays'],
]);

test('returns 401 for guests', function (): void {
    $this->postJson('/api/clients', ['name' => 'Nordlys', 'type' => ClientType::Direct->value])
        ->assertUnauthorized();
});
