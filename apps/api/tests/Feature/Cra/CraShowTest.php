<?php

declare(strict_types=1);

use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Users\Models\User;

test('returns the grid alongside the mission and client it reports on', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user, fn ($factory) => $factory->throughEsn('Callisto'));
    $cra = craDays(
        craOwnedBy($user, $mission, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000, '2026-07-07' => 5_000],
    );

    $this->actingAs($user)
        ->getJson("/api/cras/{$cra->id}")
        ->assertOk()
        ->assertJsonPath('cra.id', $cra->id)
        ->assertJsonPath('cra.month', '2026-07')
        ->assertJsonPath('cra.totalDays', 1.5)
        ->assertJsonPath('mission.id', $mission->id)
        ->assertJsonPath('client.id', $mission->client_id)
        ->assertJsonPath('recipientName', 'Callisto');
});

test('marks a sent CRA as no longer editable', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy($user, null, fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->getJson("/api/cras/{$cra->id}")
        ->assertOk()
        ->assertJsonPath('cra.status', CraStatus::Sent->value)
        ->assertJsonPath('cra.editable', false)
        ->assertJsonPath('cra.sentOn', now()->toDateString());
});

test('never calls a sent CRA dirty, however the tracked time moves afterwards', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    $cra = craDays(
        craOwnedBy($user, $mission, fn ($factory) => $factory->sent()->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );
    trackedDay($user, $mission, '2026-07-20');

    $this->actingAs($user)
        ->getJson("/api/cras/{$cra->id}")
        ->assertOk()
        // The client holds this document; nothing about it is still editable, so
        // "dirty" would only offer a reset that returns 409.
        ->assertJsonPath('cra.dirty', false)
        ->assertJsonPath('cra.editable', false);
});

test('has no estimated amount on a mission with no rate', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user, fn ($factory) => $factory->nonBillable());
    $cra = craDays(
        craOwnedBy($user, $mission, fn ($factory) => $factory->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $this->actingAs($user)
        ->getJson("/api/cras/{$cra->id}")
        ->assertOk()
        ->assertJsonPath('cra.estimatedAmount', null);
});

test('cannot read another user CRA', function (): void {
    $user = User::factory()->create();
    $cra = craOwnedBy(User::factory()->create());

    $this->actingAs($user)
        ->getJson("/api/cras/{$cra->id}")
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $cra = craOwnedBy(User::factory()->create());

    $this->getJson("/api/cras/{$cra->id}")->assertUnauthorized();
});
