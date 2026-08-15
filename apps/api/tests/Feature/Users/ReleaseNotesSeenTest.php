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

test('stores the version the client displayed when marking release notes as seen', function (): void {
    $user = User::factory()->create(['release_notes_seen_version' => null]);

    $this->actingAs($user)
        ->putJson('/api/user/release-notes-seen', ['version' => '0.11.0'])
        ->assertOk()
        ->assertJsonPath('releaseNotesSeenVersion', '0.11.0');

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'release_notes_seen_version' => '0.11.0',
    ]);
});

test('never regresses the stored version when a stale client marks as seen', function (): void {
    $user = User::factory()->create(['release_notes_seen_version' => '0.12.0']);

    $this->actingAs($user)
        ->putJson('/api/user/release-notes-seen', ['version' => '0.9.0'])
        ->assertOk()
        ->assertJsonPath('releaseNotesSeenVersion', '0.12.0');

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'release_notes_seen_version' => '0.12.0',
    ]);
});

test('rejects a malformed version', function (string $version): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/user/release-notes-seen', ['version' => $version])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['version']);
})->with([
    'prefixed' => 'v0.10.0',
    'prerelease' => '0.10.0-beta',
    'garbage' => 'latest',
]);

test('returns 401 for guests', function (): void {
    $this->putJson('/api/user/release-notes-seen', ['version' => '0.10.0'])
        ->assertUnauthorized();
});
