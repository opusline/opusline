<?php

declare(strict_types=1);

use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Missions\Models\Mission;
use App\Domain\Missions\Models\MissionBillingStep;
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
    'time on another mission' => [function (User $user, Mission $mission): array {
        $other = missionOwnedBy($user, fn ($factory) => $factory->state(['rate_cents' => 55_000]));

        return [
            TimeEntry::factory()->for($mission, 'mission')->create(['user_id' => $user->id])->id,
            TimeEntry::factory()->for($other, 'mission')->create(['user_id' => $user->id])->id,
        ];
    }],
    'time marked non-billable' => [fn (User $user, Mission $mission): array => [
        TimeEntry::factory()->for($mission, 'mission')->create([
            'user_id' => $user->id,
            'billable' => false,
        ])->id,
    ]],
    'time already on another invoice' => [function (User $user, Mission $mission): array {
        $invoice = invoiceForMission($user, $mission);

        return [invoicedTimeEntry($user, $mission, $invoice)->id];
    }],
    'another user time' => [function (User $user, Mission $mission): array {
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
        ->assertJsonPath('todo.0.work.timeEntryIds', $entries->modelKeys());
});

test('bills a fixed-price mission without ever touching the time tracked on it', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->fixed()->state(['rate_cents' => 800_000]));
    $entries = TimeEntry::factory()->for($mission, 'mission')->count(3)->create([
        'user_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $mission->client_id,
            'missionId' => $mission->id,
            'number' => 'F-2026-014',
            'status' => 1,
            'amountHt' => ['amount' => 240_000, 'currency' => 'EUR'],
            'timeEntryIds' => [],
        ])
        ->assertCreated();

    foreach ($entries as $entry) {
        expect($entry->refresh()->invoice_id)->toBeNull();
    }

    // The invoice must move the forfait on and nothing else: a forfait bills a
    // price, so its time is never work waiting to be invoiced, before or after.
    $this->actingAs($user)
        ->getJson('/api/invoices/summary')
        ->assertOk()
        ->assertJsonPath('unbilled.amount.amount', 0)
        ->assertJsonPath('unbilled.count', 0)
        ->assertJsonPath('todoTotal', 0);

    $this->actingAs($user)
        ->getJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}/billing")
        ->assertOk()
        ->assertJsonPath('invoiced.amount', 240_000)
        ->assertJsonPath('remaining.amount', 560_000);
});

test('marks the instalment it was created from as billed', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->fixed()->state(['rate_cents' => 800_000]));
    $step = MissionBillingStep::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $invoiceId = $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $mission->client_id,
            'missionId' => $mission->id,
            'number' => 'F-2026-014',
            'status' => 1,
            'amountHt' => ['amount' => 240_000, 'currency' => 'EUR'],
            'billingStepId' => $step->id,
        ])
        ->assertCreated()
        ->json('invoice.id');

    expect($step->refresh()->invoice_id)->toBe($invoiceId);
});

test('refuses an instalment that belongs to another mission', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->fixed());
    $other = missionOwnedBy($user, fn ($factory) => $factory->fixed());
    $step = MissionBillingStep::factory()->for($other, 'mission')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $mission->client_id,
            'missionId' => $mission->id,
            'amountHt' => ['amount' => 240_000, 'currency' => 'EUR'],
            'billingStepId' => $step->id,
        ])
        ->assertJsonValidationErrors('billingStepId');

    expect($step->refresh()->invoice_id)->toBeNull();
});

test('refuses an instalment an invoice already bills', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->fixed());
    $existing = invoiceForMission($user, $mission, fn ($factory) => $factory->sent());
    $step = MissionBillingStep::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'invoice_id' => $existing->id,
    ]);

    $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $mission->client_id,
            'missionId' => $mission->id,
            'amountHt' => ['amount' => 240_000, 'currency' => 'EUR'],
            'billingStepId' => $step->id,
        ])
        ->assertJsonValidationErrors('billingStepId');
});

test('puts a deleted invoice instalment back on the schedule', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->fixed());
    $step = MissionBillingStep::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $invoiceId = $this->actingAs($user)
        ->postJson('/api/invoices', [
            'clientId' => $mission->client_id,
            'missionId' => $mission->id,
            'amountHt' => ['amount' => 240_000, 'currency' => 'EUR'],
            'billingStepId' => $step->id,
        ])
        ->assertCreated()
        ->json('invoice.id');

    $this->actingAs($user)->deleteJson("/api/invoices/{$invoiceId}")->assertNoContent();

    // Same reason deleting an invoice releases its time: the instalment is owed
    // again, and a schedule still pointing at a row that is gone would hide it.
    expect($step->refresh()->invoice_id)->toBeNull();
});
