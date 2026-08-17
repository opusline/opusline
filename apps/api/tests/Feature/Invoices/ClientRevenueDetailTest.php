<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
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
        ->assertJsonPath('currentMonth.amount', 30_000)
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
