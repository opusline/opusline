<?php

declare(strict_types=1);

use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;

test('resolves an entry belonging to the authenticated user', function (): void {
    $entry = TimeEntry::factory()->create();

    $this->actingAs($entry->user);

    expect((new TimeEntry)->resolveRouteBinding($entry->id)?->getKey())->toBe($entry->id);
});

test('does not resolve an entry belonging to another user', function (): void {
    $entry = TimeEntry::factory()->create();

    $this->actingAs(User::factory()->create());

    expect((new TimeEntry)->resolveRouteBinding($entry->id))->toBeNull();
});

test('does not resolve anything for a guest', function (): void {
    $entry = TimeEntry::factory()->create();

    expect((new TimeEntry)->resolveRouteBinding($entry->id))->toBeNull();
});
