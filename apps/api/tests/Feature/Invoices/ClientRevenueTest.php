<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('requires authentication', function (): void {
    $this->getJson('/api/client-revenue')->assertUnauthorized();
});

test('echoes the civil year the year-to-date figures cover', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/client-revenue')
        ->assertOk()
        ->assertJsonPath('year', 2026);
});

test('lists a client with no invoices at zero rather than omitting it', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->getJson('/api/client-revenue')
        ->assertOk()
        ->assertJsonPath('clients.0.clientId', $client->id)
        ->assertJsonPath('clients.0.yearToDate.amount', 0)
        ->assertJsonPath('clients.0.pending.amount', 0)
        ->assertJsonPath('clients.0.averagePaymentDelayDays', null);
});

test('counts sent and paid invoices of the current year toward year to date', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    invoiceOwnedBy($user, $client, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-03-04',
        'amount_ht_cents' => 100_000,
    ]));
    invoiceOwnedBy($user, $client, fn ($factory) => $factory->paid()->state([
        'issued_on' => '2026-07-01',
        'amount_ht_cents' => 40_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/client-revenue')
        ->assertOk()
        ->assertJsonPath('clients.0.yearToDate.amount', 140_000);
});

test('leaves drafts out of year to date', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    invoiceOwnedBy($user, $client, fn ($factory) => $factory->state([
        'issued_on' => '2026-03-04',
        'amount_ht_cents' => 100_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/client-revenue')
        ->assertOk()
        ->assertJsonPath('clients.0.yearToDate.amount', 0);
});

test('leaves last year invoices out of year to date', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    invoiceOwnedBy($user, $client, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2025-12-31',
        'amount_ht_cents' => 100_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/client-revenue')
        ->assertOk()
        ->assertJsonPath('clients.0.yearToDate.amount', 0);
});

test('counts only unsettled issued invoices as pending, across years', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    invoiceOwnedBy($user, $client, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2025-11-02',
        'amount_ht_cents' => 30_000,
    ]));
    invoiceOwnedBy($user, $client, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-02',
        'amount_ht_cents' => 12_000,
    ]));
    invoiceOwnedBy($user, $client, fn ($factory) => $factory->paid()->state([
        'issued_on' => '2026-08-02',
        'amount_ht_cents' => 99_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/client-revenue')
        ->assertOk()
        ->assertJsonPath('clients.0.pending.amount', 42_000);
});

test('averages the days between issue and payment over settled invoices', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    invoiceOwnedBy($user, $client, fn ($factory) => $factory->paid()->state([
        'issued_on' => '2026-01-01',
        'paid_on' => '2026-01-11',
    ]));
    invoiceOwnedBy($user, $client, fn ($factory) => $factory->paid()->state([
        'issued_on' => '2026-02-01',
        'paid_on' => '2026-02-21',
    ]));

    $this->actingAs($user)
        ->getJson('/api/client-revenue')
        ->assertOk()
        ->assertJsonPath('clients.0.averagePaymentDelayDays', 15);
});

test('reports no average delay while the client has never settled an invoice', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    invoiceOwnedBy($user, $client, fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->getJson('/api/client-revenue')
        ->assertOk()
        ->assertJsonPath('clients.0.averagePaymentDelayDays', null);
});

test('splits revenue across the missions it was billed against', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-03',
        'amount_ht_cents' => 70_000,
    ]));
    invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-02-03',
        'amount_ht_cents' => 25_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/client-revenue')
        ->assertOk()
        ->assertJsonPath('clients.0.missions.0.missionId', $mission->id)
        ->assertJsonPath('clients.0.missions.0.yearToDate.amount', 95_000)
        ->assertJsonPath('clients.0.missions.0.currentMonth.amount', 70_000);
});

test('totals mission revenue across every year for the cumulative figure', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2025-05-02',
        'amount_ht_cents' => 60_000,
    ]));
    invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-02',
        'amount_ht_cents' => 40_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/client-revenue')
        ->assertOk()
        ->assertJsonPath('clients.0.missions.0.total.amount', 100_000)
        ->assertJsonPath('clients.0.missions.0.yearToDate.amount', 40_000);
});

test('spreads the mission monthly average over dry months too', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    // One invoice in June, nothing since: June, July and August share the total.
    invoiceForMission($user, $mission, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-06-15',
        'amount_ht_cents' => 90_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/client-revenue')
        ->assertOk()
        ->assertJsonPath('clients.0.missions.0.monthlyAverage.amount', 30_000);
});

test('reports no monthly average while the mission has never been invoiced', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    $this->actingAs($user)
        ->getJson('/api/client-revenue')
        ->assertOk()
        ->assertJsonPath('clients.0.missions.0.missionId', $mission->id)
        ->assertJsonPath('clients.0.missions.0.monthlyAverage', null)
        ->assertJsonPath('clients.0.missions.0.total.amount', 0);
});

test('keeps client-level invoices in the client total and out of every mission', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    invoiceOwnedBy($user, $mission->client, fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-03',
        'amount_ht_cents' => 50_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/client-revenue')
        ->assertOk()
        ->assertJsonPath('clients.0.yearToDate.amount', 50_000)
        ->assertJsonPath('clients.0.missions.0.yearToDate.amount', 0);
});

test('never reports another account revenue', function (): void {
    $user = User::factory()->create();
    $stranger = User::factory()->create();

    invoiceOwnedBy($stranger, configure: fn ($factory) => $factory->sent()->state([
        'issued_on' => '2026-08-03',
        'amount_ht_cents' => 500_000,
    ]));

    $this->actingAs($user)
        ->getJson('/api/client-revenue')
        ->assertOk()
        ->assertJsonPath('clients', []);
});
