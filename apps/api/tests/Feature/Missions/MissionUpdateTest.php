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
        ->putJson("/api/clients/{$client->slug}/missions/{$mission->slug}", [
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
        ->putJson("/api/clients/{$client->slug}/missions/{$mission->slug}", [
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
        ->putJson("/api/clients/{$client->slug}/missions/{$mission->slug}", [
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
        ->putJson("/api/clients/{$client->slug}/missions/{$mission->slug}", [
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
        ->putJson("/api/clients/{$client->slug}/missions/{$mission->slug}", [
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
        ->putJson("/api/clients/{$client->slug}/missions/{$mission->slug}", [
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
    $mission = Mission::factory()->for($esn, 'client')->throughEsn('Callisto')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$esn->slug}/missions/{$mission->slug}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Active->value,
            'endClientName' => 'Callisto Group',
        ])
        ->assertOk()
        ->assertJsonPath('endClientName', 'Callisto Group');

    $this->assertDatabaseHas('missions', ['id' => $mission->id, 'end_client_name' => 'Callisto Group']);
});

test('requires an end client name for an intermediary client', function (): void {
    $user = User::factory()->create();
    $esn = Client::factory()->for($user)->intermediary()->create();
    $mission = Mission::factory()->for($esn, 'client')->throughEsn('Callisto')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$esn->slug}/missions/{$mission->slug}", [
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
        ->putJson("/api/clients/{$client->slug}/missions/{$mission->slug}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Active->value,
            'endClientName' => 'Callisto',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['endClientName']);
});

test('rejects a rate for an internal client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->internal()->create();
    $mission = Mission::factory()->for($client, 'client')->nonBillable()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->slug}/missions/{$mission->slug}", [
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
    $mission = Mission::factory()->for($esn, 'client')->throughEsn('Callisto')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$esn->slug}/missions/{$mission->slug}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Active->value,
            'endClientName' => 'Callisto',
            'craRequired' => false,
            'color' => Color::Plum->value,
            'notes' => 'CRA à envoyer avant le 3 du mois.',
        ])
        ->assertOk()
        ->assertJsonPath('craRequired', false)
        ->assertJsonPath('color', Color::Plum->value)
        ->assertJsonPath('notes', 'CRA à envoyer avant le 3 du mois.');
});

test('refuses a cra on an hourly mission, since a CRA counts days', function (): void {
    $user = User::factory()->create();
    $esn = Client::factory()->for($user)->intermediary()->create();
    $mission = Mission::factory()->for($esn, 'client')->throughEsn('Callisto')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$esn->slug}/missions/{$mission->slug}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Hourly->value,
            'status' => MissionStatus::Active->value,
            'endClientName' => 'Callisto',
            'craRequired' => true,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['craRequired']);
});

test('refuses to leave day billing while comptes rendus exist', function (): void {
    $user = User::factory()->create();
    $esn = Client::factory()->for($user)->intermediary()->create();
    $mission = Mission::factory()->for($esn, 'client')->throughEsn('Callisto')->requiringCra()->create([
        'user_id' => $user->id,
    ]);
    craOwnedBy($user, $mission, fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->putJson("/api/clients/{$esn->slug}/missions/{$mission->slug}", [
            'name' => $mission->name,
            'billingMode' => BillingMode::Hourly->value,
            'status' => MissionStatus::Active->value,
            'endClientName' => 'Callisto',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['billingMode']);

    $this->assertDatabaseHas('missions', [
        'id' => $mission->id,
        'billing_mode' => BillingMode::Daily->value,
        'cra_required' => true,
    ]);
});

test('rejects a non positive rate', function (int $amount): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $mission = Mission::factory()->for($client, 'client')->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->putJson("/api/clients/{$client->slug}/missions/{$mission->slug}", [
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
        ->putJson("/api/clients/{$client->slug}/missions/{$mission->slug}", [
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
        ->putJson("/api/clients/{$otherClient->slug}/missions/{$mission->slug}", [
            'name' => 'Hijacked',
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Active->value,
        ])
        ->assertNotFound();
});

test('cannot update another user mission', function (): void {
    $mission = Mission::factory()->create();

    $this->actingAs(User::factory()->create())
        ->putJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}", [
            'name' => 'Hijacked',
            'billingMode' => BillingMode::Daily->value,
            'status' => MissionStatus::Active->value,
        ])
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $mission = Mission::factory()->create();

    $this->putJson("/api/clients/{$mission->client->slug}/missions/{$mission->slug}", [
        'name' => 'X',
        'billingMode' => BillingMode::Daily->value,
        'status' => MissionStatus::Active->value,
    ])->assertUnauthorized();
});
