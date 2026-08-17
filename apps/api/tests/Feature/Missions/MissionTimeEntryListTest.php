<?php

declare(strict_types=1);

use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

function missionEntriesUrl(Mission $mission): string
{
    return "/api/clients/{$mission->client->slug}/missions/{$mission->slug}/time-entries";
}

test('requires authentication', function (): void {
    $mission = missionOwnedBy(User::factory()->create());

    $this->getJson(missionEntriesUrl($mission))->assertUnauthorized();
});

test('lists the entries of the mission newest first', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    foreach (['2026-08-03', '2026-08-11', '2026-08-07'] as $date) {
        TimeEntry::factory()->for($mission, 'mission')->create([
            'user_id' => $user->id,
            'date' => $date,
        ]);
    }

    $this->actingAs($user)
        ->getJson(missionEntriesUrl($mission))
        ->assertOk()
        ->assertJsonPath('timeEntries.0.date', '2026-08-11')
        ->assertJsonPath('timeEntries.1.date', '2026-08-07')
        ->assertJsonPath('timeEntries.2.date', '2026-08-03');
});

test('reads the whole history, not just the current year', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'date' => '2023-02-14',
    ]);

    $this->actingAs($user)
        ->getJson(missionEntriesUrl($mission))
        ->assertOk()
        ->assertJsonCount(1, 'timeEntries')
        ->assertJsonPath('timeEntries.0.date', '2023-02-14');
});

test('never returns the entries of another mission', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $otherMission = missionOwnedBy($user);

    TimeEntry::factory()->for($otherMission, 'mission')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->getJson(missionEntriesUrl($mission))
        ->assertOk()
        ->assertJsonCount(0, 'timeEntries');
});

test('reports whether an invoice already bills the entry', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $invoice = invoiceForMission($user, $mission, fn ($factory) => $factory->sent());

    invoicedTimeEntry($user, $mission, $invoice);
    TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'date' => '2026-08-01',
    ]);

    $response = $this->actingAs($user)
        ->getJson(missionEntriesUrl($mission))
        ->assertOk();

    $invoicedFlags = array_column($response->json('timeEntries'), 'invoiced');

    expect($invoicedFlags)->toContain(true)->toContain(false);
});

test('hides a mission of another account behind a 404', function (): void {
    $stranger = missionOwnedBy(User::factory()->create());

    $this->actingAs(User::factory()->create())
        ->getJson(missionEntriesUrl($stranger))
        ->assertNotFound();
});
