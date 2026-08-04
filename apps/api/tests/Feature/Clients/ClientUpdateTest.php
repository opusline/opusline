<?php

declare(strict_types=1);

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Clients\Models\Client;
use App\Domain\Shared\Enums\Color;
use App\Domain\Users\Models\User;

test('updates a client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['name' => 'Old name', 'notes' => 'old']);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}", [
            'name' => 'New name',
            'type' => ClientType::Direct->value,
        ])
        ->assertOk()
        ->assertJsonPath('name', 'New name')
        ->assertJsonPath('notes', null);

    $this->assertDatabaseHas('clients', ['id' => $client->id, 'name' => 'New name', 'notes' => null]);
});

test('updates the client type', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}", [
            'name' => $client->name,
            'type' => ClientType::Intermediary->value,
        ])
        ->assertOk()
        ->assertJsonPath('type', ClientType::Intermediary->value);

    $this->assertDatabaseHas('clients', ['id' => $client->id, 'type' => ClientType::Intermediary->value]);
});

test('resets omitted optional fields to their defaults', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create([
        'siret' => '123 456 789 00012',
        'color' => Color::Sage,
        'payment_terms_days' => 60,
    ]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}", [
            'name' => $client->name,
            'type' => ClientType::Direct->value,
        ])
        ->assertOk()
        ->assertJsonPath('siret', null)
        ->assertJsonPath('color', Color::Amber->value)
        ->assertJsonPath('paymentTermsDays', 45);
});

test('keeps the slug when the client is renamed', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['name' => 'Old name']);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}", [
            'name' => 'Completely new name',
            'type' => ClientType::Direct->value,
        ])
        ->assertOk()
        ->assertJsonPath('slug', $client->slug);
});

test('keeps its own name on update', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['name' => 'Nordlys']);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}", [
            'name' => 'Nordlys',
            'type' => ClientType::Direct->value,
            'notes' => 'updated',
        ])
        ->assertOk()
        ->assertJsonPath('name', 'Nordlys')
        ->assertJsonPath('notes', 'updated');
});

test('rejects a name already used by a sibling client', function (): void {
    $user = User::factory()->create();
    Client::factory()->for($user)->create(['name' => 'Nordlys']);
    $client = Client::factory()->for($user)->create(['name' => 'Studio Lorem']);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}", [
            'name' => 'Nordlys',
            'type' => ClientType::Direct->value,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

test('allows a name used by another user client', function (): void {
    Client::factory()->create(['name' => 'Nordlys']);

    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['name' => 'Studio Lorem']);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}", [
            'name' => 'Nordlys',
            'type' => ClientType::Direct->value,
        ])
        ->assertOk()
        ->assertJsonPath('name', 'Nordlys');
});

test('rejects an invalid payload', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}", ['name' => '', 'type' => ClientType::Direct->value])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

test('cannot update another user client', function (): void {
    $client = Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->putJson("/api/clients/{$client->id}", [
            'name' => 'Hijacked',
            'type' => ClientType::Direct->value,
        ])
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $client = Client::factory()->create();

    $this->putJson("/api/clients/{$client->id}", [
        'name' => 'New name',
        'type' => ClientType::Direct->value,
    ])->assertUnauthorized();
});
