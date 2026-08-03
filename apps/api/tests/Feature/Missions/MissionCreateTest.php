<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\MissionStatus;
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
        ->assertJsonPath('endClientId', null);

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

test('creates a mission billed through an esn', function (): void {
    $user = User::factory()->create();
    $esn = Client::factory()->for($user)->create();
    $endClient = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$esn->id}/missions", [
            'name' => 'OGF front',
            'billingMode' => BillingMode::Daily->value,
            'rate' => ['amount' => 55_000, 'currency' => 'EUR'],
            'endClientId' => $endClient->id,
        ])
        ->assertCreated()
        ->assertJsonPath('clientId', $esn->id)
        ->assertJsonPath('endClientId', $endClient->id);
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

test('rejects an end client belonging to another user', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $foreignClient = Client::factory()->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", [
            'name' => 'M',
            'billingMode' => BillingMode::Daily->value,
            'endClientId' => $foreignClient->id,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['endClientId']);
});

test('rejects an end client equal to the billing client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson("/api/clients/{$client->id}/missions", [
            'name' => 'M',
            'billingMode' => BillingMode::Daily->value,
            'endClientId' => $client->id,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['endClientId']);
});

test('returns 401 for guests', function (): void {
    $client = Client::factory()->create();

    $this->postJson("/api/clients/{$client->id}/missions", [])->assertUnauthorized();
});
