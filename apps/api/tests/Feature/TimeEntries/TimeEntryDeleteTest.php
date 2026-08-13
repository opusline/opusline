<?php

declare(strict_types=1);

use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;

test('deletes a time entry', function (): void {
    $user = User::factory()->create();
    $entry = TimeEntry::factory()->for(missionOwnedBy($user), 'mission')->create();

    $this->actingAs($user)
        ->deleteJson("/api/time-entries/{$entry->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('time_entries', ['id' => $entry->id]);
});

test('frees the mission for deletion once its last entry is gone', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $entry = TimeEntry::factory()->for($mission, 'mission')->create();

    $this->actingAs($user)->deleteJson("/api/time-entries/{$entry->id}")->assertNoContent();

    $this->actingAs($user)
        ->deleteJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}")
        ->assertNoContent();
});

test('cannot delete another user entry', function (): void {
    $entry = TimeEntry::factory()->create();

    $this->actingAs(User::factory()->create())
        ->deleteJson("/api/time-entries/{$entry->id}")
        ->assertNotFound();

    $this->assertDatabaseHas('time_entries', ['id' => $entry->id]);
});

test('returns 401 for guests', function (): void {
    $entry = TimeEntry::factory()->create();

    $this->deleteJson("/api/time-entries/{$entry->id}")->assertUnauthorized();
});

test('refuses to delete tracked time that an invoice bills', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    $timeEntry = invoicedTimeEntry($user, $mission, invoiceForMission($user, $mission));

    $this->actingAs($user)
        ->deleteJson("/api/time-entries/{$timeEntry->id}")
        ->assertConflict()
        ->assertJsonPath('message', __('invoices.cannot_delete_invoiced_time_entry'));

    $this->assertDatabaseHas('time_entries', ['id' => $timeEntry->id]);
});
