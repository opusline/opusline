<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('replaces the grid with the days sent', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000, '2026-07-07' => 10_000],
    );

    $this->actingAs($user)
        ->putJson("/api/cras/{$cra->id}/days", ['days' => [
            ['date' => '2026-07-06', 'dayFractionBp' => 5_000],
            ['date' => '2026-07-08', 'dayFractionBp' => 10_000],
        ]])
        ->assertOk()
        ->assertJsonPath('cra.totalDays', 1.5)
        ->assertJsonPath('cra.dirty', true);

    $this->assertDatabaseHas('cra_days', ['cra_id' => $cra->id, 'date' => '2026-07-06', 'day_fraction_bp' => 5_000]);
    $this->assertDatabaseHas('cra_days', ['cra_id' => $cra->id, 'date' => '2026-07-08', 'day_fraction_bp' => 10_000]);
    $this->assertDatabaseMissing('cra_days', ['cra_id' => $cra->id, 'date' => '2026-07-07']);
});

test('clears every day when the grid is emptied', function (): void {
    $user = User::factory()->create();
    $cra = craDays(
        craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $this->actingAs($user)
        ->putJson("/api/cras/{$cra->id}/days", ['days' => []])
        ->assertOk()
        ->assertJsonPath('cra.totalDays', 0);

    $this->assertDatabaseCount('cra_days', 0);
});

test('reports a grid matching tracked time as not dirty', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    trackedDay($user, $mission, '2026-07-06');
    $cra = craOwnedBy($user, $mission, fn ($factory) => $factory->forMonth('2026-07'));

    $this->actingAs($user)
        ->putJson("/api/cras/{$cra->id}/days", ['days' => [
            ['date' => '2026-07-06', 'dayFractionBp' => 10_000],
        ]])
        ->assertOk()
        ->assertJsonPath('cra.dirty', false)
        ->assertJsonPath('cra.differenceDays', 0);
});

test('reports the écart against tracked time', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    trackedDay($user, $mission, '2026-07-06');
    $cra = craOwnedBy($user, $mission, fn ($factory) => $factory->forMonth('2026-07'));

    $this->actingAs($user)
        ->putJson("/api/cras/{$cra->id}/days", ['days' => [
            ['date' => '2026-07-06', 'dayFractionBp' => 10_000],
            ['date' => '2026-07-07', 'dayFractionBp' => 5_000],
        ]])
        ->assertOk()
        ->assertJsonPath('cra.differenceDays', 0.5);
});

test('refuses to change a CRA the client already holds', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy($user, null, fn ($factory) => $factory->sent()->forMonth('2026-07'));

    $this->actingAs($user)
        ->putJson("/api/cras/{$cra->id}/days", ['days' => [
            ['date' => '2026-07-06', 'dayFractionBp' => 10_000],
        ]])
        ->assertStatus(409);
});

test('refuses a day outside the CRA month', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07'));

    $this->actingAs($user)
        ->putJson("/api/cras/{$cra->id}/days", ['days' => [
            ['date' => '2026-08-03', 'dayFractionBp' => 10_000],
        ]])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['days.0.date']);
});

test('refuses the same day twice', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07'));

    $this->actingAs($user)
        ->putJson("/api/cras/{$cra->id}/days", ['days' => [
            ['date' => '2026-07-06', 'dayFractionBp' => 10_000],
            ['date' => '2026-07-06', 'dayFractionBp' => 5_000],
        ]])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['days.1.date']);
});

test('rejects an invalid payload', function (array $days, string $expectedError): void {
    $user = User::factory()->create();
    $cra = craOwnedBy($user, null, fn ($factory) => $factory->forMonth('2026-07'));

    $this->actingAs($user)
        ->putJson("/api/cras/{$cra->id}/days", ['days' => $days])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$expectedError]);
})->with([
    'more than a whole day' => [[['date' => '2026-07-06', 'dayFractionBp' => 10_001]], 'days.0.dayFractionBp'],
    'a day worth nothing' => [[['date' => '2026-07-06', 'dayFractionBp' => 0]], 'days.0.dayFractionBp'],
    'a negative day' => [[['date' => '2026-07-06', 'dayFractionBp' => -5_000]], 'days.0.dayFractionBp'],
    'a fractional basis point' => [[['date' => '2026-07-06', 'dayFractionBp' => 1.5]], 'days.0.dayFractionBp'],
    'a malformed date' => [[['date' => '06/07/2026', 'dayFractionBp' => 10_000]], 'days.0.date'],
    'a missing value' => [[['date' => '2026-07-06']], 'days.0.dayFractionBp'],
]);

test('cannot change another user CRA', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy(User::factory()->create(), null, fn ($factory) => $factory->forMonth('2026-07'));

    $this->actingAs($user)
        ->putJson("/api/cras/{$cra->id}/days", ['days' => []])
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $cra = craOwnedBy(User::factory()->create());

    $this->putJson("/api/cras/{$cra->id}/days", ['days' => []])->assertUnauthorized();
});
