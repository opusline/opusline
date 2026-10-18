<?php

declare(strict_types=1);

use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/** A 550 € TJM mission, billed by the half day. */
function dailyMissionOf(User $user): Mission
{
    return missionOwnedBy($user, fn ($factory) => $factory->state([
        'rate_cents' => 55_000,
        'rounding' => EntryRounding::Half,
    ]));
}

function trackedOn(Mission $mission, string $date, int $minutes = 420): TimeEntry
{
    return TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $mission->user_id,
        'date' => $date,
        'duration_minutes' => $minutes,
    ]);
}

test('lists the work no invoice covers yet, one period per mission', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['contribution_rate_bp' => 2_600]);
    $mission = dailyMissionOf($user);
    $mission->client->update(['name' => 'Nordlys']);
    trackedOn($mission, '2026-08-07', 120);
    trackedOn($mission, '2026-08-03');

    // 1,5 days at 550 €, less 26 % cotisations and 0,2 % CFP.
    $this->actingAs($user)
        ->getJson('/api/uninvoiced-periods')
        ->assertOk()
        ->assertExactJson(['periods' => [[
            'id' => $mission->id,
            'client' => 'Nordlys',
            'from' => '2026-08-03',
            'to' => '2026-08-07',
            'days' => 1.5,
            'minutes' => null,
            'amountHt' => ['amount' => 82_500, 'currency' => 'EUR'],
            'amountNet' => ['amount' => 60_885, 'currency' => 'EUR'],
        ]]]);
});

test('measures a mission billed by the hour in minutes', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->hourly()->state([
        'rate_cents' => 8_000,
        'rounding' => EntryRounding::Quarter,
    ]));
    trackedOn($mission, '2026-08-03', 67);

    $this->actingAs($user)
        ->getJson('/api/uninvoiced-periods')
        ->assertOk()
        ->assertJsonPath('periods.0.days', null)
        ->assertJsonPath('periods.0.minutes', 75)
        ->assertJsonPath('periods.0.amountHt.amount', 10_000);
});

test('lists the richest period first', function (): void {
    $user = User::factory()->create();
    $small = dailyMissionOf($user);
    trackedOn($small, '2026-08-03');
    $large = dailyMissionOf($user);
    trackedOn($large, '2026-08-03');
    trackedOn($large, '2026-08-04');

    $this->actingAs($user)
        ->getJson('/api/uninvoiced-periods')
        ->assertOk()
        ->assertJsonPath('periods.0.id', $large->id)
        ->assertJsonPath('periods.1.id', $small->id);
});

test('has no net outside french fiscality', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_country' => 'DE']);
    trackedOn(dailyMissionOf($user), '2026-08-03');

    $this->actingAs($user)
        ->getJson('/api/uninvoiced-periods')
        ->assertOk()
        ->assertJsonPath('periods.0.amountHt.amount', 55_000)
        ->assertJsonPath('periods.0.amountNet', null);
});

test('drops a period once an invoice covers all of its time', function (): void {
    $user = User::factory()->create();
    $mission = dailyMissionOf($user);
    $entries = [trackedOn($mission, '2026-08-03'), trackedOn($mission, '2026-08-04')];

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $mission->client_id,
            'missionId' => $mission->id,
            'amountHt' => ['amount' => 110_000, 'currency' => 'EUR'],
            'timeEntryIds' => array_map(fn (TimeEntry $entry): int => $entry->id, $entries),
        ])
        ->assertCreated();

    $this->actingAs($user)
        ->getJson('/api/uninvoiced-periods')
        ->assertOk()
        ->assertExactJson(['periods' => []]);
});

test('drops a period once an invoice written in Opusline covers it', function (): void {
    $user = issuableAccount();
    $client = billableClient($user);
    $mission = Mission::factory()->for($user)->for($client)->create(['rate_cents' => 55_000, 'rounding' => EntryRounding::Half]);
    $entry = trackedOn($mission, '2026-08-03');

    draftFor($user, $client, ['missionId' => $mission->id, 'timeEntryIds' => [$entry->id]]);

    $this->actingAs($user)
        ->getJson('/api/uninvoiced-periods')
        ->assertOk()
        ->assertExactJson(['periods' => []]);
});

test('keeps what an invoice left out under the same id', function (): void {
    $user = User::factory()->create();
    $mission = dailyMissionOf($user);
    $invoiced = trackedOn($mission, '2026-08-03');
    trackedOn($mission, '2026-08-04');

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $mission->client_id,
            'missionId' => $mission->id,
            'amountHt' => ['amount' => 55_000, 'currency' => 'EUR'],
            'timeEntryIds' => [$invoiced->id],
        ])
        ->assertCreated();

    $this->actingAs($user)
        ->getJson('/api/uninvoiced-periods')
        ->assertOk()
        ->assertJsonCount(1, 'periods')
        ->assertJsonPath('periods.0.id', $mission->id)
        ->assertJsonPath('periods.0.from', '2026-08-04')
        ->assertJsonPath('periods.0.amountHt.amount', 55_000);
});

test('keeps an account to its own periods', function (): void {
    trackedOn(dailyMissionOf(User::factory()->create()), '2026-08-03');

    $this->actingAs(User::factory()->create())
        ->getJson('/api/uninvoiced-periods')
        ->assertOk()
        ->assertExactJson(['periods' => []]);
});

test('refuses a guest', function (): void {
    $this->getJson('/api/uninvoiced-periods')->assertUnauthorized();
});
