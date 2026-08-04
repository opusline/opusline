<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Shared\Enums\Color;
use App\Domain\Users\Models\User;

test('creates a daily mission', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", [
            'name' => 'OGF front',
            'billingMode' => BillingMode::Daily->value,
            'rate' => ['amount' => 55_000, 'currency' => 'EUR'],
            'startDate' => '2026-08-01',
        ])
        ->assertCreated()
        ->assertJsonPath('clientId', $client->id)
        ->assertJsonPath('slug', 'ogf-front')
        ->assertJsonPath('billingMode', BillingMode::Daily->value)
        ->assertJsonPath('rate.amount', 55_000)
        ->assertJsonPath('rate.currency', 'EUR')
        ->assertJsonPath('status', MissionStatus::Active->value)
        ->assertJsonPath('endClientName', null)
        ->assertJsonPath('color', null);

    $this->assertDatabaseHas('missions', [
        'user_id' => $user->id,
        'client_id' => $client->id,
        'name' => 'OGF front',
        'rate_cents' => 55_000,
    ]);
});

test('creates an hourly mission', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", [
            'name' => 'Maintenance',
            'billingMode' => BillingMode::Hourly->value,
            'rate' => ['amount' => 8_500, 'currency' => 'EUR'],
        ])
        ->assertCreated()
        ->assertJsonPath('billingMode', BillingMode::Hourly->value)
        ->assertJsonPath('rate.amount', 8_500);
});

test('creates a fixed price mission without rounding', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", [
            'name' => 'HartPrint site',
            'billingMode' => BillingMode::Fixed->value,
            'rate' => ['amount' => 480_000, 'currency' => 'EUR'],
        ])
        ->assertCreated()
        ->assertJsonPath('billingMode', BillingMode::Fixed->value)
        ->assertJsonPath('rate.amount', 480_000)
        ->assertJsonPath('rounding', null);

    $this->assertDatabaseHas('missions', ['name' => 'HartPrint site', 'rounding' => null]);
});

test('rejects a rounding for a fixed price mission', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", [
            'name' => 'HartPrint site',
            'billingMode' => BillingMode::Fixed->value,
            'rounding' => EntryRounding::Half->value,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['rounding']);
});

test('defaults the rounding to half a unit for time based missions', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", [
            'name' => 'OGF front',
            'billingMode' => BillingMode::Daily->value,
        ])
        ->assertCreated()
        ->assertJsonPath('rounding', EntryRounding::Half->value);
});

test('accepts an explicit rounding', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", [
            'name' => 'OGF front',
            'billingMode' => BillingMode::Daily->value,
            'rounding' => EntryRounding::Quarter->value,
        ])
        ->assertCreated()
        ->assertJsonPath('rounding', EntryRounding::Quarter->value);
});

test('creates a non billable mission when no rate is given', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", [
            'name' => 'Opusline',
            'billingMode' => BillingMode::Hourly->value,
        ])
        ->assertCreated()
        ->assertJsonPath('rate', null);

    $this->assertDatabaseHas('missions', ['name' => 'Opusline', 'rate_cents' => null]);
});

test('creates a mission with an end client name for an intermediary client', function (): void {
    $user = User::factory()->create();
    $esn = Client::factory()->for($user)->intermediary()->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$esn->id}/missions", [
            'name' => 'OGF front',
            'billingMode' => BillingMode::Daily->value,
            'rate' => ['amount' => 55_000, 'currency' => 'EUR'],
            'endClientName' => 'OGF',
        ])
        ->assertCreated()
        ->assertJsonPath('clientId', $esn->id)
        ->assertJsonPath('endClientName', 'OGF');

    $this->assertDatabaseHas('missions', ['name' => 'OGF front', 'end_client_name' => 'OGF']);
});

test('requires an end client name for an intermediary client', function (): void {
    $user = User::factory()->create();
    $esn = Client::factory()->for($user)->intermediary()->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$esn->id}/missions", [
            'name' => 'OGF front',
            'billingMode' => BillingMode::Daily->value,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['endClientName']);
});

test('rejects an end client name for a direct client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", [
            'name' => 'OGF front',
            'billingMode' => BillingMode::Daily->value,
            'endClientName' => 'OGF',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['endClientName']);
});

test('rejects an end client name for an internal client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->internal()->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", [
            'name' => 'Opusline',
            'billingMode' => BillingMode::Hourly->value,
            'endClientName' => 'OGF',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['endClientName']);
});

test('rejects a rate for an internal client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->internal()->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", [
            'name' => 'Opusline',
            'billingMode' => BillingMode::Hourly->value,
            'rate' => ['amount' => 8_500, 'currency' => 'EUR'],
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['rate']);
});

test('creates a non billable mission for an internal client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->internal()->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", [
            'name' => 'Opusline',
            'billingMode' => BillingMode::Hourly->value,
        ])
        ->assertCreated()
        ->assertJsonPath('rate', null)
        ->assertJsonPath('craRequired', false);
});

test('defaults cra to required for intermediary clients', function (): void {
    $user = User::factory()->create();
    $esn = Client::factory()->for($user)->intermediary()->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$esn->id}/missions", [
            'name' => 'OGF front',
            'billingMode' => BillingMode::Daily->value,
            'endClientName' => 'OGF',
        ])
        ->assertCreated()
        ->assertJsonPath('craRequired', true);
});

test('defaults cra to not required for direct clients', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", [
            'name' => 'Maintenance',
            'billingMode' => BillingMode::Hourly->value,
        ])
        ->assertCreated()
        ->assertJsonPath('craRequired', false);
});

test('accepts an explicit cra flag', function (): void {
    $user = User::factory()->create();
    $esn = Client::factory()->for($user)->intermediary()->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$esn->id}/missions", [
            'name' => 'OGF front',
            'billingMode' => BillingMode::Daily->value,
            'endClientName' => 'OGF',
            'craRequired' => false,
        ])
        ->assertCreated()
        ->assertJsonPath('craRequired', false);
});

test('stores a color and notes', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", [
            'name' => 'OGF front',
            'billingMode' => BillingMode::Daily->value,
            'color' => Color::Slate->value,
            'notes' => 'Refonte du front de souscription.',
        ])
        ->assertCreated()
        ->assertJsonPath('color', Color::Slate->value)
        ->assertJsonPath('notes', 'Refonte du front de souscription.');
});

test('rejects an invalid payload', function (array $payload, string $expectedError): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", $payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$expectedError]);
})->with([
    'missing name' => [['billingMode' => BillingMode::Daily->value], 'name'],
    'unknown billing mode' => [['name' => 'M', 'billingMode' => 99], 'billingMode'],
    'unknown rounding' => [['name' => 'M', 'billingMode' => BillingMode::Daily->value, 'rounding' => 99], 'rounding'],
    'unknown color' => [['name' => 'M', 'billingMode' => BillingMode::Daily->value, 'color' => 99], 'color'],
    'zero rate' => [['name' => 'M', 'billingMode' => BillingMode::Daily->value, 'rate' => ['amount' => 0, 'currency' => 'EUR']], 'rate.amount'],
    'unsupported currency' => [['name' => 'M', 'billingMode' => BillingMode::Daily->value, 'rate' => ['amount' => 100, 'currency' => 'USD']], 'rate.currency'],
    'end before start' => [['name' => 'M', 'billingMode' => BillingMode::Daily->value, 'startDate' => '2026-08-02', 'endDate' => '2026-08-01'], 'endDate'],
]);

test('rejects a client belonging to another user', function (): void {
    $foreignClient = Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->postJson("/api/clients/{$foreignClient->id}/missions", [
            'name' => 'Hijack',
            'billingMode' => BillingMode::Daily->value,
        ])
        ->assertNotFound();
});

test('returns 401 for guests', function (): void {
    $client = Client::factory()->create();

    $this->postJson("/api/clients/{$client->id}/missions", [])->assertUnauthorized();
});
