<?php

declare(strict_types=1);

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\FixedPriceBudgetState;
use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/** @return ?array<string, mixed> */
function budgetOf(User $user, Mission $mission): ?array
{
    return test()->actingAs($user)
        ->getJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}/revenue")
        ->assertOk()
        ->json('fixedPrice');
}

test('reads an overrun forfait the way the mission header states it', function (): void {
    $user = User::factory()->create();
    $mission = forfaitWith($user, forfaitCents: 480_000, referenceCents: 55_000, days: 11);

    invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state(['amount_ht_cents' => 240_000]));

    $budget = budgetOf($user, $mission);

    expect($budget['forfait']['amount'])->toBe(480_000)
        ->and($budget['invoiced']['amount'])->toBe(240_000)
        ->and($budget['draft']['amount'])->toBe(0)
        ->and($budget['remaining']['amount'])->toBe(240_000)
        ->and($budget['invoicedShareBp'])->toBe(5_000)
        ->and($budget['consumption']['consumed']['amount'])->toBe(605_000)
        ->and($budget['consumption']['consumedShareBp'])->toBe(12_604)
        ->and($budget['consumption']['trackedDays'])->toEqual(11)
        ->and($budget['consumption']['coveredDays'])->toBeGreaterThan(8.72)
        ->and($budget['consumption']['coveredDays'])->toBeLessThan(8.73)
        ->and($budget['consumption']['remainingDays'])->toBeLessThan(-2.27)
        ->and($budget['consumption']['overrun']['amount'])->toBe(125_000)
        ->and($budget['consumption']['state'])->toBe(FixedPriceBudgetState::Exceeded->value);
});

test('holds a draft back from what is left to invoice', function (): void {
    $user = User::factory()->create();
    $mission = forfaitWith($user, forfaitCents: 1_000_000, referenceCents: 48_000, days: 18);

    invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state(['amount_ht_cents' => 288_000]));
    invoiceForMission($user, $mission, fn ($factory) => $factory->state(['amount_ht_cents' => 144_000]));

    $budget = budgetOf($user, $mission);

    expect($budget['invoiced']['amount'])->toBe(288_000)
        ->and($budget['draft']['amount'])->toBe(144_000)
        ->and($budget['remaining']['amount'])->toBe(568_000)
        ->and($budget['invoicedShareBp'])->toBe(2_880)
        ->and($budget['consumption']['consumedShareBp'])->toBe(8_640)
        ->and($budget['consumption']['overrun']['amount'])->toBe(0)
        ->and($budget['consumption']['remainingDays'])->toBeGreaterThan(2.83)
        ->and($budget['consumption']['state'])->toBe(FixedPriceBudgetState::Warning->value);
});

test('reports a negative balance once a forfait has been over-invoiced', function (): void {
    $user = User::factory()->create();
    $mission = forfaitWith($user, forfaitCents: 480_000, referenceCents: 55_000, days: 1);

    invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state(['amount_ht_cents' => 600_000]));

    expect(budgetOf($user, $mission)['remaining']['amount'])->toBe(-120_000);
});

test('leaves consumption unanswered when no reference rate is set', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->fixed());

    TimeEntry::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $budget = budgetOf($user, $mission);

    expect($budget['consumption'])->toBeNull()
        ->and($budget['forfait']['amount'])->toBe(1_200_000);
});

test('leaves non-billable time out of what a forfait has consumed', function (): void {
    $user = User::factory()->create();
    $mission = forfaitWith($user, forfaitCents: 480_000, referenceCents: 55_000, days: 1);

    TimeEntry::factory()->for($mission, 'mission')->nonBillable()->create([
        'user_id' => $user->id,
        'date' => '2026-08-20',
    ]);

    expect(budgetOf($user, $mission)['consumption']['consumed']['amount'])->toBe(55_000);
});

test('reports no budget on a mission billed by the day', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    expect(budgetOf($user, $mission))->toBeNull();
});

test('carries every fixed price mission of the listing', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create(['type' => ClientType::Direct]);
    $forfait = forfaitWith($user, forfaitCents: 480_000, referenceCents: 55_000, days: 11, client: $client);

    $missions = collect($this->actingAs($user)->getJson('/api/client-revenue')->assertOk()->json('clients'))
        ->firstWhere('clientId', $client->id)['missions'];

    expect(collect($missions)->firstWhere('missionId', $forfait->id)['fixedPrice']['consumption']['consumedShareBp'])
        ->toBe(12_604);
});

test('counts a forfait overrun by cents as overrun, not merely warned', function (): void {
    $user = User::factory()->create();
    // One day at 10 000,50 € against a 10 000 € price: the share floors back to
    // exactly 100 %, so only the money says the forfait is past its price.
    $mission = forfaitWith($user, forfaitCents: 1_000_000, referenceCents: 1_000_050, days: 1);

    $consumption = budgetOf($user, $mission)['consumption'];

    expect($consumption['consumedShareBp'])->toBe(10_000)
        ->and($consumption['overrun']['amount'])->toBe(50)
        ->and($consumption['state'])->toBe(FixedPriceBudgetState::Exceeded->value);
});
