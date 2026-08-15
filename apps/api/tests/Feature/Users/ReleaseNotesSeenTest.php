<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('seeds a new account with the current app version', function (): void {
    fromSpa()->postJson('/api/register', [
        'name' => 'Théo Marchand',
        'email' => 'theo@marchand.dev',
        'password' => 'secret-password',
        'password_confirmation' => 'secret-password',
    ])
        ->assertCreated()
        ->assertJsonPath('releaseNotesSeenVersion', config()->string('app.version'));

    $this->assertDatabaseHas('users', [
        'email' => 'theo@marchand.dev',
        'release_notes_seen_version' => config()->string('app.version'),
    ]);
});

test('stamps the current app version when marking release notes as seen', function (): void {
    $user = User::factory()->create(['release_notes_seen_version' => null]);

    $this->actingAs($user)
        ->putJson('/api/user/release-notes-seen')
        ->assertOk()
        ->assertJsonPath('releaseNotesSeenVersion', config()->string('app.version'));

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'release_notes_seen_version' => config()->string('app.version'),
    ]);
});

test('returns 401 for guests', function (): void {
    $this->putJson('/api/user/release-notes-seen')
        ->assertUnauthorized();
});
