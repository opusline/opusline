<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Missions\Factories\MissionFactory;
use App\Domain\Missions\Models\Mission;
use App\Domain\Users\Models\User;

test('lists a month with tracked time as still to produce, with no row behind it', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user, fn ($factory) => $factory->done());
    trackedDay($user, $mission, '2026-07-06');

    $this->actingAs($user)
        ->getJson('/api/cras')
        ->assertOk()
        ->assertJsonCount(1, 'cras')
        ->assertJsonPath('cras.0.id', null)
        ->assertJsonPath('cras.0.month', '2026-07')
        ->assertJsonPath('cras.0.status', CraStatus::Draft->value)
        ->assertJsonPath('cras.0.totalDays', 0)
        ->assertJsonPath('cras.0.trackedDays', 1)
        ->assertJsonPath('cras.0.missionName', $mission->name)
        ->assertJsonPath('counts.toProduce', 1);
});

test('never creates a row just by listing', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    trackedDay($user, $mission, '2026-07-06');

    $this->actingAs($user)->getJson('/api/cras')->assertOk();

    $this->assertDatabaseCount('cras', 0);
});

test('offers the current month while the mission is active', function (): void {
    $user = User::factory()->create();
    craMissionOwnedBy($user);

    $this->actingAs($user)
        ->getJson('/api/cras')
        ->assertOk()
        ->assertJsonCount(1, 'cras')
        ->assertJsonPath('cras.0.month', now()->format('Y-m'));
});

test('does not offer the current month on a mission that is over', function (): void {
    $user = User::factory()->create();
    craMissionOwnedBy($user, fn ($factory) => $factory->done());

    $this->actingAs($user)
        ->getJson('/api/cras')
        ->assertOk()
        ->assertJsonCount(0, 'cras');
});

test('keeps listing a sent CRA whose tracked time has since been deleted', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user, fn ($factory) => $factory->done());
    craDays(
        craOwnedBy($user, $mission, fn ($factory) => $factory->sent()->forMonth('2026-07')),
        ['2026-07-06' => 10_000],
    );

    $this->actingAs($user)
        ->getJson('/api/cras')
        ->assertOk()
        ->assertJsonCount(1, 'cras')
        ->assertJsonPath('cras.0.month', '2026-07')
        ->assertJsonPath('cras.0.status', CraStatus::Sent->value)
        ->assertJsonPath('cras.0.totalDays', 1)
        ->assertJsonPath('cras.0.trackedDays', 0)
        ->assertJsonPath('counts.sent', 1);
});

test('leaves out a mission whose client does not ask for a CRA', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    trackedDay($user, $mission, '2026-07-06');

    $this->actingAs($user)
        ->getJson('/api/cras')
        ->assertOk()
        ->assertJsonCount(0, 'cras');
});

test('leaves out an hourly mission, since a CRA counts days', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn (MissionFactory $factory): MissionFactory => $factory->hourly());
    $mission->forceFill(['cra_required' => true])->save();
    trackedDay($user, $mission, '2026-07-06');

    $this->actingAs($user)
        ->getJson('/api/cras')
        ->assertOk()
        ->assertJsonCount(0, 'cras');
});

test('leaves out a mission of an archived client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->archived()->create();
    $mission = Mission::factory()->for($client, 'client')->requiringCra()->create(['user_id' => $user->id]);
    trackedDay($user, $mission, '2026-07-06');

    $this->actingAs($user)
        ->getJson('/api/cras')
        ->assertOk()
        ->assertJsonCount(0, 'cras');
});

test('narrows the list to one month on request', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user, fn ($factory) => $factory->done());
    trackedDay($user, $mission, '2026-06-08');
    trackedDay($user, $mission, '2026-07-06');

    $this->actingAs($user)
        ->getJson('/api/cras?month=2026-07')
        ->assertOk()
        ->assertJsonCount(1, 'cras')
        ->assertJsonPath('cras.0.month', '2026-07');
});

test('keeps the counters over the whole list when one month is asked for', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user, fn ($factory) => $factory->done());
    trackedDay($user, $mission, '2026-06-08');
    trackedDay($user, $mission, '2026-07-06');

    $this->actingAs($user)
        ->getJson('/api/cras?month=2026-07')
        ->assertOk()
        ->assertJsonCount(1, 'cras')
        // Two months are still owed; looking at July must not say otherwise.
        ->assertJsonPath('counts.toProduce', 2);
});

test('does not offer a month that has not started, since it cannot be opened', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    trackedDay($user, $mission, now()->addYear()->format('Y-m-15'));

    $months = $this->actingAs($user)->getJson('/api/cras')->assertOk()->json('cras.*.month');

    expect($months)->toBe([now()->format('Y-m')]);
});

test('rejects a malformed month filter', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/cras?month=juillet')
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['month']);
});

test('lists the newest month first', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user, fn ($factory) => $factory->done());
    trackedDay($user, $mission, '2026-05-04');
    trackedDay($user, $mission, '2026-07-06');
    trackedDay($user, $mission, '2026-06-08');

    $months = $this->actingAs($user)->getJson('/api/cras')->assertOk()->json('cras.*.month');

    expect($months)->toBe(['2026-07', '2026-06', '2026-05']);
});

test('never shows another user CRA', function (): void {
    $user = User::factory()->create();
    $stranger = User::factory()->create();
    $mission = craMissionOwnedBy($stranger);
    trackedDay($stranger, $mission, '2026-07-06');

    $this->actingAs($user)
        ->getJson('/api/cras')
        ->assertOk()
        ->assertJsonCount(0, 'cras');
});

test('returns 401 for guests', function (): void {
    $this->getJson('/api/cras')->assertUnauthorized();
});
