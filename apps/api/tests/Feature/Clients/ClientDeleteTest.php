<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;

test('deletes a client without missions', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$client->slug}")
        ->assertNoContent();

    $this->assertDatabaseMissing('clients', ['id' => $client->id]);
});

test('refuses to delete a client with missions', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$client->slug}")
        ->assertConflict()
        ->assertJsonPath('message', __('clients.cannot_delete_with_missions'));

    $this->assertDatabaseHas('clients', ['id' => $client->id]);
});

test('returns 409 when a mission appears while the delete is running', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    Client::deleting(function (Client $deleting) use ($user): void {
        Mission::factory()->for($deleting, 'client')->create(['user_id' => $user->id]);
    });

    try {
        $this->actingAs($user)
            ->deleteJson("/api/clients/{$client->slug}")
            ->assertConflict()
            ->assertJsonPath('message', __('clients.cannot_delete_with_missions'));
    } finally {
        Client::flushEventListeners();
        Client::clearBootedModels();
    }

    $this->assertDatabaseHas('clients', ['id' => $client->id]);
});

test('cannot delete another user client', function (): void {
    $client = Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->deleteJson("/api/clients/{$client->slug}")
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $client = Client::factory()->create();

    $this->deleteJson("/api/clients/{$client->slug}")->assertUnauthorized();
});
