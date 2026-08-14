<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Users\Models\User;

test('lists invoices with the client and mission they are filed under', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    invoiceForMission($user, $mission);

    $this->actingAs($user)
        ->getJson('/api/invoices')
        ->assertOk()
        ->assertJsonCount(1, 'invoices')
        ->assertJsonPath('invoices.0.client.id', $mission->client_id)
        ->assertJsonPath('invoices.0.mission.id', $mission->id);
});

test('returns a null mission for a client-wide invoice', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user);

    $this->actingAs($user)
        ->getJson('/api/invoices')
        ->assertOk()
        ->assertJsonPath('invoices.0.mission', null);
});

test('totals each client per scope so the screen never sums money', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    invoiceOwnedBy($user, $client, fn ($factory) => $factory->state(['amount_ttc_cents' => 10_000]));
    invoiceOwnedBy($user, $client, fn ($factory) => $factory->sent()->state([
        'amount_ttc_cents' => 20_000,
        'due_on' => '2030-01-01',
    ]));
    invoiceOwnedBy($user, $client, fn ($factory) => $factory->overdue()->state(['amount_ttc_cents' => 40_000]));
    invoiceOwnedBy($user, $client, fn ($factory) => $factory->paid()->state(['amount_ttc_cents' => 80_000]));

    $otherClient = Client::factory()->for($user)->create();
    invoiceOwnedBy($user, $otherClient, fn ($factory) => $factory->paid()->state(['amount_ttc_cents' => 100_000]));

    $response = $this->actingAs($user)
        ->getJson('/api/invoices')
        ->assertOk()
        ->assertJsonCount(2, 'clientTotals');

    $totals = collect($response->json('clientTotals'))->keyBy('clientId');

    expect($totals[$client->id]['all']['amount'])->toBe(150_000)
        ->and($totals[$client->id]['open']['amount'])->toBe(60_000)
        ->and($totals[$client->id]['late']['amount'])->toBe(40_000)
        ->and($totals[$client->id]['paid']['amount'])->toBe(80_000)
        ->and($totals[$client->id]['draft']['amount'])->toBe(10_000)
        ->and($totals[$otherClient->id]['all']['amount'])->toBe(100_000);
});

test('keeps the client totals whole when the list itself is filtered', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    invoiceOwnedBy($user, $client, fn ($factory) => $factory->state(['amount_ttc_cents' => 10_000]));
    invoiceOwnedBy($user, $client, fn ($factory) => $factory->paid()->state(['amount_ttc_cents' => 80_000]));

    $this->actingAs($user)
        ->getJson('/api/invoices?status='.InvoiceStatus::Paid->value)
        ->assertOk()
        ->assertJsonCount(1, 'invoices')
        ->assertJsonPath('clientTotals.0.all.amount', 90_000)
        ->assertJsonPath('clientTotals.0.draft.amount', 10_000)
        ->assertJsonPath('clientTotals.0.paid.amount', 80_000);
});

test('filters by status', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user);
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid());

    $this->actingAs($user)
        ->getJson('/api/invoices?status='.InvoiceStatus::Paid->value)
        ->assertOk()
        ->assertJsonCount(1, 'invoices')
        ->assertJsonPath('invoices.0.invoice.status', InvoiceStatus::Paid->value);
});

test('filters by client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    invoiceOwnedBy($user, $client);
    invoiceOwnedBy($user);

    $this->actingAs($user)
        ->getJson("/api/invoices?clientId={$client->id}")
        ->assertOk()
        ->assertJsonCount(1, 'invoices')
        ->assertJsonPath('invoices.0.client.id', $client->id);
});

test('filters by mission', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);
    invoiceForMission($user, $mission);
    invoiceOwnedBy($user);

    $this->actingAs($user)
        ->getJson("/api/invoices?missionId={$mission->id}")
        ->assertOk()
        ->assertJsonCount(1, 'invoices');
});

test('filters by issue date range', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->state(['issued_on' => '2026-01-15']));
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->state(['issued_on' => '2026-08-15']));

    $this->actingAs($user)
        ->getJson('/api/invoices?from=2026-08-01&to=2026-08-31')
        ->assertOk()
        ->assertJsonCount(1, 'invoices')
        ->assertJsonPath('invoices.0.invoice.issuedOn', '2026-08-15');
});

test('filters the overdue invoices in and out', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->overdue());
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->getJson('/api/invoices?late=1')
        ->assertOk()
        ->assertJsonCount(1, 'invoices')
        ->assertJsonPath('invoices.0.invoice.isLate', true);

    $this->actingAs($user)
        ->getJson('/api/invoices?late=0')
        ->assertOk()
        ->assertJsonCount(1, 'invoices')
        ->assertJsonPath('invoices.0.invoice.isLate', false);
});

test('does not treat a paid invoice past its due date as late', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->overdue()->paid());

    $this->actingAs($user)
        ->getJson('/api/invoices')
        ->assertOk()
        ->assertJsonPath('invoices.0.invoice.isLate', false);
});
