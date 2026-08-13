<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('rebuilds the grid from tracked time', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    trackedDay($user, $mission, '2026-07-06');
    trackedDay($user, $mission, '2026-07-07', minutes: 210);
    $cra = craDays(
        craOwnedBy($user, $mission, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-20' => 10_000],
    );

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/reset")
        ->assertOk()
        ->assertJsonPath('cra.totalDays', 1.5)
        ->assertJsonPath('cra.dirty', false);

    $this->assertDatabaseHas('cra_days', ['cra_id' => $cra->id, 'date' => '2026-07-06', 'day_fraction_bp' => 10_000]);
    $this->assertDatabaseHas('cra_days', ['cra_id' => $cra->id, 'date' => '2026-07-07', 'day_fraction_bp' => 5_000]);
    $this->assertDatabaseMissing('cra_days', ['cra_id' => $cra->id, 'date' => '2026-07-20']);
});

test('empties the grid when the month has no tracked time left', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/reset")
        ->assertOk()
        ->assertJsonPath('cra.totalDays', 0);

    $this->assertDatabaseCount('cra_days', 0);
});

test('refuses to reset a CRA the client already holds', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy($user, null, fn ($factory) => $factory->sent()->forMonth('2026-07'));

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/reset")
        ->assertStatus(409);
});

test('cannot reset another user CRA', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy(User::factory()->create());

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/reset")
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $cra = craOwnedBy(User::factory()->create());

    $this->postJson("/api/cras/{$cra->id}/reset")->assertUnauthorized();
});
