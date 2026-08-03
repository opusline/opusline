<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Users\Models\User;

test('archives a client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $response = $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/archive")
        ->assertOk();

    expect($response->json('archivedAt'))->not->toBeNull()
        ->and($client->refresh()->archived_at)->not->toBeNull();
});

test('unarchives a client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->archived()->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/unarchive")
        ->assertOk()
        ->assertJsonPath('archivedAt', null);

    expect($client->refresh()->archived_at)->toBeNull();
});

test('cannot archive another user client', function (): void {
    $client = Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->postJson("/api/clients/{$client->id}/archive")
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $client = Client::factory()->create();

    $this->postJson("/api/clients/{$client->id}/archive")->assertUnauthorized();
});
