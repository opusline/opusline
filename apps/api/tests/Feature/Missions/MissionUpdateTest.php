<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Enums\Color;
use App\Domain\Users\Models\User;

test('updates a mission', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}/missions/{$mission->id}", [
            'name' => 'Renamed',
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Paused->value,
            'rate' => ['amount' => 60_000, 'currency' => 'EUR'],
            'startDate' => '2026-08-01',
            'endDate' => '2026-12-31',
        ])
        ->assertOk()
        ->assertJsonPath('name', 'Renamed')
        ->assertJsonPath('status', MissionStatus::Paused->value)
        ->assertJsonPath('rate.amount', 60_000);

    $this->assertDatabaseHas('missions', [
        'id' => $mission->id,
        'name' => 'Renamed',
        'status' => MissionStatus::Paused->value,
        'rate_cents' => 60_000,
    ]);
});

test('changes the billing mode', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Hourly->value,
            'status' => MissionStatus::Active->value,
        ])
        ->assertOk()
        ->assertJsonPath('billingMode', BillingMode::Hourly->value);

    expect($mission->refresh()->billing_mode)->toBe(BillingMode::Hourly);
});

test('switches to fixed price and clears the rounding', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Fixed->value,
            'status' => MissionStatus::Active->value,
            'rate' => ['amount' => 480_000, 'currency' => 'EUR'],
        ])
        ->assertOk()
        ->assertJsonPath('billingMode', BillingMode::Fixed->value)
        ->assertJsonPath('rounding', null);

    $this->assertDatabaseHas('missions', ['id' => $mission->id, 'rounding' => null]);
});

test('rejects a rounding when switching to fixed price', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Fixed->value,
            'status' => MissionStatus::Active->value,
            'rounding' => EntryRounding::Half->value,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['rounding']);
});

test('resets an omitted rounding to half a unit', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create([
        'user_id' => $user->id,
        'rounding' => EntryRounding::Quarter,
    ]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Active->value,
        ])
        ->assertOk()
        ->assertJsonPath('rounding', EntryRounding::Half->value);
});

test('makes a mission non billable when the rate is omitted', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Active->value,
        ])
        ->assertOk()
        ->assertJsonPath('rate', null);

    $this->assertDatabaseHas('missions', ['id' => $mission->id, 'rate_cents' => null]);
});

test('updates the end client name for an intermediary client', function (): void {
    $user = User::factory()->create();
    $esn = Client::factory()->for($user)->intermediary()->create();
    $mission = Mission::factory()->for($esn, 'client')->throughEsn('OGF')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$esn->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Active->value,
            'endClientName' => 'OGF Group',
        ])
        ->assertOk()
        ->assertJsonPath('endClientName', 'OGF Group');

    $this->assertDatabaseHas('missions', ['id' => $mission->id, 'end_client_name' => 'OGF Group']);
});

test('requires an end client name for an intermediary client', function (): void {
    $user = User::factory()->create();
    $esn = Client::factory()->for($user)->intermediary()->create();
    $mission = Mission::factory()->for($esn, 'client')->throughEsn('OGF')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$esn->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Active->value,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['endClientName']);
});

test('rejects an end client name for a direct client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Active->value,
            'endClientName' => 'OGF',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['endClientName']);
});

test('rejects a rate for an internal client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->internal()->create();
    $mission = Mission::factory()->for($client, 'client')->nonBillable()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Hourly->value,
            'status' => MissionStatus::Active->value,
            'rate' => ['amount' => 8_500, 'currency' => 'EUR'],
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['rate']);
});

test('updates the cra flag, color and notes', function (): void {
    $user = User::factory()->create();
    $esn = Client::factory()->for($user)->intermediary()->create();
    $mission = Mission::factory()->for($esn, 'client')->throughEsn('OGF')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$esn->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Active->value,
            'endClientName' => 'OGF',
            'craRequired' => false,
            'color' => Color::Plum->value,
            'notes' => 'CRA à envoyer avant le 3 du mois.',
        ])
        ->assertOk()
        ->assertJsonPath('craRequired', false)
        ->assertJsonPath('color', Color::Plum->value)
        ->assertJsonPath('notes', 'CRA à envoyer avant le 3 du mois.');
});

test('rejects a non positive rate', function (int $amount): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Active->value,
            'rate' => ['amount' => $amount, 'currency' => 'EUR'],
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['rate.amount']);
})->with(['zero' => 0, 'negative' => -100]);

test('does not move the mission to another client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $otherClient = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->id}/missions/{$mission->id}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Active->value,
            'clientId' => $otherClient->id,
        ])
        ->assertOk()
        ->assertJsonPath('clientId', $client->id);
});

test('cannot update a mission through a different client of the same user', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $otherClient = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$otherClient->id}/missions/{$mission->id}", [
            'name' => 'Hijacked',
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Active->value,
        ])
        ->assertNotFound();
});

test('cannot update another user mission', function (): void {
    $mission = Mission::factory()->create();

    $this->actingAs(User::factory()->create())
        ->putJson("/api/clients/{$mission->client_id}/missions/{$mission->id}", [
            'name' => 'Hijacked',
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Active->value,
        ])
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $mission = Mission::factory()->create();

    $this->putJson("/api/clients/{$mission->client_id}/missions/{$mission->id}", [
        'name' => 'X',
        'billingMode' => BillingMode::Daily->value,
        'status' => MissionStatus::Active->value,
    ])->assertUnauthorized();
});
