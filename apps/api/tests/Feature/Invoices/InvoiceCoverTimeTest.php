<?php

declare(strict_types=1);

use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;

function coverPayload(int $clientId, ?int $missionId, array $timeEntryIds): array
{
    return [
        'clientId' => $clientId,
        'missionId' => $missionId,
        'amountHt' => ['amount' => 165_000, 'currency' => 'EUR'],
        'timeEntryIds' => $timeEntryIds,
    ];
}

test('marks the tracked time it was created from as billed', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state([
        'rate_cents' => 55_000,
        'rounding' => EntryRounding::Half,
    ]));
    $entries = TimeEntry::factory()->for($mission, 'mission')->count(3)->create([
        'user_id' => $user->id,
    ]);

    $invoiceId = $this->actingAs($user)
        ->postJson('/api/invoices', coverPayload($mission->client_id, $mission->id, $entries->modelKeys()))
        ->assertCreated()
        ->json('invoice.id');

    foreach ($entries as $entry) {
        expect($entry->refresh()->invoice_id)->toBe($invoiceId);
    }
});

test('drops covered time out of what is still to invoice', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state(['rate_cents' => 55_000]));
    $entry = TimeEntry::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson('/api/invoices', coverPayload($mission->client_id, $mission->id, [$entry->id]))
        ->assertCreated();

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('todoTotal', 0)
        ->assertJsonPath('monthUnbilled.amount.amount', 0);
});

test('creates nothing when one of the entries cannot be covered', function (callable $arrange): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state(['rate_cents' => 55_000]));
    $timeEntryIds = $arrange($user, $mission);
    $before = $user->invoices()->count();

    $this->actingAs($user)
        ->postJson('/api/invoices', coverPayload($mission->client_id, $mission->id, $timeEntryIds))
        ->assertUnprocessable()
        ->assertJsonValidationErrors('timeEntryIds');

    expect($user->invoices()->count())->toBe($before);
})->with([
    'time on another mission' => [function (User $user, $mission): array {
        $other = missionOwnedBy($user, fn ($factory) => $factory->state(['rate_cents' => 55_000]));

        return [
            TimeEntry::factory()->for($mission, 'mission')->create(['user_id' => $user->id])->id,
            TimeEntry::factory()->for($other, 'mission')->create(['user_id' => $user->id])->id,
        ];
    }],
    'time marked non-billable' => [fn (User $user, $mission): array => [
        TimeEntry::factory()->for($mission, 'mission')->create([
            'user_id' => $user->id,
            'billable' => false,
        ])->id,
    ]],
    'time already on another invoice' => [function (User $user, $mission): array {
        $invoice = invoiceForMission($user, $mission);

        return [invoicedTimeEntry($user, $mission, $invoice)->id];
    }],
    'another user time' => [function (User $user, $mission): array {
        $stranger = User::factory()->create();
        $strangerMission = missionOwnedBy($stranger, fn ($factory) => $factory->state(['rate_cents' => 55_000]));

        return [TimeEntry::factory()->for($strangerMission, 'mission')->create([
            'user_id' => $stranger->id,
        ])->id];
    }],
]);

test('refuses to cover time with an invoice that has no mission', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state(['rate_cents' => 55_000]));
    $entry = TimeEntry::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson('/api/invoices', coverPayload($mission->client_id, null, [$entry->id]))
        ->assertUnprocessable()
        ->assertJsonValidationErrors('timeEntryIds');

    expect($entry->refresh()->invoice_id)->toBeNull();
});

test('covers nothing when no time is named', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state(['rate_cents' => 55_000]));
    $entry = TimeEntry::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson('/api/invoices', coverPayload($mission->client_id, $mission->id, []))
        ->assertCreated();

    expect($entry->refresh()->invoice_id)->toBeNull();
});

test('offers the summary the entries a row would bill', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->state(['rate_cents' => 55_000]));
    $entries = TimeEntry::factory()->for($mission, 'mission')->count(2)->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('todo.0.timeEntryIds', $entries->modelKeys());
});
