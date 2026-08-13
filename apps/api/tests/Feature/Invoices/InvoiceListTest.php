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
