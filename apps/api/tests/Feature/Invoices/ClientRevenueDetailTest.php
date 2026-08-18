<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\TimeEntries\Models\TimeEntry;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('requires authentication to read one client revenue', function (): void {
    $client = Client::factory()->for(User::factory())->create();

    $this->getJson("/api/clients/{$client->slug}/revenue")->assertUnauthorized();
});

test('requires authentication to read one mission revenue', function (): void {
    $mission = missionOwnedBy(User::factory()->create());

    $this->getJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}/revenue")
        ->assertUnauthorized();
});

test('reports one client figures without folding the rest of the account', function (): void {
    $user = User::factory()->create();
    $nordlys = Client::factory()->for($user)->create(['name' => 'Nordlys']);
    $orvella = Client::factory()->for($user)->create(['name' => 'Orvella']);

    invoiceOwnedBy($user, $nordlys, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-03-04',
        'amount_ht_cents' => 70_000,
        'amount_ttc_cents' => 84_000,
    ]));
    invoiceOwnedBy($user, $orvella, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-03-04',
        'amount_ht_cents' => 25_000,
    ]));

    $this->actingAs($user)
        ->getJson("/api/clients/{$nordlys->slug}/revenue")
        ->assertOk()
        ->assertJsonPath('year', 2026)
        ->assertJsonPath('revenue.clientId', $nordlys->id)
        ->assertJsonPath('revenue.yearToDate.amount', 70_000)
        ->assertJsonPath('revenue.pending.amount', 84_000);
});

test('carries every mission of the client so the detail rows can read them', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $refonte = Mission::factory()->for($client)->create(['name' => 'Refonte', 'user_id' => $user->id]);
    $maintenance = Mission::factory()->for($client)->create(['name' => 'Maintenance', 'user_id' => $user->id]);

    invoiceForMission($user, $refonte, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-03',
        'amount_ht_cents' => 70_000,
    ]));

    $missions = collect($this->actingAs($user)
        ->getJson("/api/clients/{$client->slug}/revenue")
        ->assertOk()
        ->json('revenue.missions'))
        ->keyBy('missionId');

    expect($missions[$refonte->id]['yearToDate']['amount'])->toBe(70_000)
        ->and($missions[$maintenance->id]['yearToDate']['amount'])->toBe(0);
});

test('reports one mission figures', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-06-15',
        'amount_ht_cents' => 60_000,
    ]));
    invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-02',
        'amount_ht_cents' => 30_000,
    ]));

    $this->actingAs($user)
        ->getJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}/revenue")
        ->assertOk()
        ->assertJsonPath('missionId', $mission->id)
        ->assertJsonPath('yearToDate.amount', 90_000)
        // Nothing tracked this month, so the month has earned nothing yet —
        // the 30 000 invoiced in August is already in yearToDate and total.
        ->assertJsonPath('currentMonth.amount', 0)
        ->assertJsonPath('total.amount', 90_000)
        // June, July and August share the total.
        ->assertJsonPath('monthlyAverage.amount', 30_000);
});

test('leaves a mission never invoiced without a monthly average', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    $this->actingAs($user)
        ->getJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}/revenue")
        ->assertOk()
        ->assertJsonStructure(['monthlyAverage'])
        ->assertJsonPath('monthlyAverage', null)
        ->assertJsonPath('total.amount', 0);
});

test('keeps another mission of the same client out of the figures', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $refonte = Mission::factory()->for($client)->create(['name' => 'Refonte', 'user_id' => $user->id]);
    $maintenance = Mission::factory()->for($client)->create(['name' => 'Maintenance', 'user_id' => $user->id]);

    invoiceForMission($user, $maintenance, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-03',
        'amount_ht_cents' => 25_000,
    ]));

    $this->actingAs($user)
        ->getJson("/api/clients/{$client->slug}/missions/{$refonte->slug}/revenue")
        ->assertOk()
        ->assertJsonPath('total.amount', 0);
});

test('404s on a client of another account', function (): void {
    $user = User::factory()->create();
    $stranger = Client::factory()->for(User::factory())->create();

    $this->actingAs($user)
        ->getJson("/api/clients/{$stranger->slug}/revenue")
        ->assertNotFound();
});

test('404s on a mission of another account', function (): void {
    $user = User::factory()->create();
    $stranger = missionOwnedBy(User::factory()->create());

    $this->actingAs($user)
        ->getJson("/api/clients/{$stranger->client->slug}/missions/{$stranger->slug}/revenue")
        ->assertNotFound();
});

test('404s on a mission that belongs to another client of the same account', function (): void {
    $user = User::factory()->create();
    $nordlys = Client::factory()->for($user)->create(['name' => 'Nordlys']);
    $mission = missionOwnedBy($user);

    $this->actingAs($user)
        ->getJson("/api/clients/{$nordlys->slug}/missions/{$mission->slug}/revenue")
        ->assertNotFound();
});

test('reports no budget block on a mission billed by the day', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    $this->actingAs($user)
        ->getJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}/revenue")
        ->assertOk()
        ->assertJsonPath('forfait', null);
});

test('reports no budget block on a fixed-price mission that carries no price', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->fixed()->state(['rate_cents' => null]));

    $this->actingAs($user)
        ->getJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}/revenue")
        ->assertOk()
        ->assertJsonPath('forfait', null);
});

test('reads a fixed price as an effort budget at its target day rate', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->fixed()->state([
        'rate_cents' => 800_000,
        'target_rate_cents' => 55_000,
    ]));

    // 8 000 € at 550 €/j buys 14,54 days; a 7 h workday makes that 6109 minutes.
    TimeEntry::factory()->for($mission, 'mission')->count(10)->create([
        'user_id' => $user->id,
        'duration_minutes' => 420,
    ]);
    invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state([
        'amount_ht_cents' => 560_000,
    ]));

    $forfait = $this->actingAs($user)
        ->getJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}/revenue")
        ->assertOk()
        ->json('forfait');

    expect($forfait['budgetMinutes'])->toBe(6109)
        ->and($forfait['trackedMinutes'])->toBe(4200)
        ->and($forfait['consumedShareBp'])->toBe(6875)
        // 5 600 € over 10 days worked: 560 €/j, above the 550 €/j target.
        ->and($forfait['effectiveRate']['amount'])->toBe(56_000);
});

test('reports no budget on a fixed price with no target rate to measure it against', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->fixed()->state(['rate_cents' => 800_000]));
    TimeEntry::factory()->for($mission, 'mission')->create(['user_id' => $user->id]);

    $forfait = $this->actingAs($user)
        ->getJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}/revenue")
        ->assertOk()
        ->json('forfait');

    // Null rather than zero: without a target there is no budget, and a zero
    // would read as "all of it, already spent".
    expect($forfait['budgetMinutes'])->toBeNull()
        ->and($forfait['consumedShareBp'])->toBeNull();
});

test('counts non-billable time against a fixed price budget', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->fixed()->state([
        'rate_cents' => 800_000,
        'target_rate_cents' => 55_000,
    ]));
    TimeEntry::factory()->for($mission, 'mission')->create([
        'user_id' => $user->id,
        'duration_minutes' => 420,
        'billable' => false,
    ]);

    // On a forfait nothing is separately billable, so effort you chose not to
    // bill still came out of the same budget.
    $this->actingAs($user)
        ->getJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}/revenue")
        ->assertOk()
        ->assertJsonPath('forfait.trackedMinutes', 420);
});

test('reports no effective rate until a fixed price has time behind it', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user, fn ($factory) => $factory->fixed()->state([
        'rate_cents' => 800_000,
        'target_rate_cents' => 55_000,
    ]));

    $this->actingAs($user)
        ->getJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}/revenue")
        ->assertOk()
        ->assertJsonPath('forfait.effectiveRate', null);
});
