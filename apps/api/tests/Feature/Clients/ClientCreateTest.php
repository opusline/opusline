<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('creates a client', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/clients', ['name' => 'Catamania', 'notes' => 'ESN — contact Julie'])
        ->assertCreated()
        ->assertJsonPath('name', 'Catamania')
        ->assertJsonPath('notes', 'ESN — contact Julie')
        ->assertJsonPath('archivedAt', null)
        ->assertJsonPath('missions', []);

    $this->assertDatabaseHas('clients', ['name' => 'Catamania', 'user_id' => $user->id]);
});

test('generates a slug from the name', function (): void {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/clients', ['name' => 'Studio Lorem'])
        ->assertCreated()
        ->assertJsonPath('slug', 'studio-lorem');
});

test('suffixes the slug when it is already taken by a different name', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)->postJson('/api/clients', ['name' => 'Catamania'])->assertCreated();

    $this->actingAs($user)
        ->postJson('/api/clients', ['name' => 'Catamania!'])
        ->assertCreated()
        ->assertJsonPath('slug', 'catamania-1');
});

test('rejects a name already used by the same user', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)->postJson('/api/clients', ['name' => 'Catamania'])->assertCreated();

    $this->actingAs($user)
        ->postJson('/api/clients', ['name' => 'Catamania'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

test('reuses the same slug across different users', function (): void {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/clients', ['name' => 'Catamania'])
        ->assertJsonPath('slug', 'catamania');

    $this->actingAs(User::factory()->create())
        ->postJson('/api/clients', ['name' => 'Catamania'])
        ->assertJsonPath('slug', 'catamania');
});

test('rejects an invalid payload', function (array $payload, string $expectedError): void {
    $this->actingAs(User::factory()->create())
        ->postJson('/api/clients', $payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$expectedError]);
})->with([
    'missing name' => [[], 'name'],
    'empty name' => [['name' => ''], 'name'],
    'name too long' => [['name' => str_repeat('a', 256)], 'name'],
]);

test('returns 401 for guests', function (): void {
    $this->postJson('/api/clients', ['name' => 'Catamania'])->assertUnauthorized();
});
