<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Users\Models\User;

test('creates a daily mission', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/missions', [
            'clientSlug' => $client->slug,
            'name' => 'OGF front',
            'billingMode' => 'daily',
            'rate' => ['amount' => 55_000, 'currency' => 'EUR'],
            'startDate' => '2026-08-01',
        ])
        ->assertCreated()
        ->assertJsonPath('clientSlug', $client->slug)
        ->assertJsonPath('billingMode', 'daily')
        ->assertJsonPath('rate.amount', 55_000)
        ->assertJsonPath('rate.currency', 'EUR')
        ->assertJsonPath('status', 'active')
        ->assertJsonPath('endClientSlug', null);

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
        ->postJson('/api/missions', [
            'clientSlug' => $client->slug,
            'name' => 'Maintenance',
            'billingMode' => 'hourly',
            'rate' => ['amount' => 8_500, 'currency' => 'EUR'],
        ])
        ->assertCreated()
        ->assertJsonPath('billingMode', 'hourly')
        ->assertJsonPath('rate.amount', 8_500);
});

test('creates a non billable mission when no rate is given', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/missions', [
            'clientSlug' => $client->slug,
            'name' => 'Opusline',
            'billingMode' => 'hourly',
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
        ->postJson('/api/missions', [
            'clientSlug' => $esn->slug,
            'name' => 'OGF front',
            'billingMode' => 'daily',
            'rate' => ['amount' => 55_000, 'currency' => 'EUR'],
            'endClientSlug' => $endClient->slug,
        ])
        ->assertCreated()
        ->assertJsonPath('clientSlug', $esn->slug)
        ->assertJsonPath('endClientSlug', $endClient->slug);
});

test('rejects an invalid payload', function (array $payload, string $expectedError): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();
    $payload = array_map(
        fn (mixed $value): mixed => $value === ':clientSlug' ? $client->slug : $value,
        $payload,
    );

    $this->actingAs($user)
        ->postJson('/api/missions', $payload)
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$expectedError]);
})->with([
    'missing client' => [['name' => 'M', 'billingMode' => 'daily'], 'clientSlug'],
    'missing name' => [['clientSlug' => ':clientSlug', 'billingMode' => 'daily'], 'name'],
    'unknown billing mode' => [['clientSlug' => ':clientSlug', 'name' => 'M', 'billingMode' => 'weekly'], 'billingMode'],
    'zero rate' => [['clientSlug' => ':clientSlug', 'name' => 'M', 'billingMode' => 'daily', 'rate' => ['amount' => 0, 'currency' => 'EUR']], 'rate.amount'],
    'unsupported currency' => [['clientSlug' => ':clientSlug', 'name' => 'M', 'billingMode' => 'daily', 'rate' => ['amount' => 100, 'currency' => 'USD']], 'rate.currency'],
    'end before start' => [['clientSlug' => ':clientSlug', 'name' => 'M', 'billingMode' => 'daily', 'startDate' => '2026-08-02', 'endDate' => '2026-08-01'], 'endDate'],
]);

test('rejects a client belonging to another user', function (): void {
    $foreignClient = Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->postJson('/api/missions', [
            'clientSlug' => $foreignClient->slug,
            'name' => 'Hijack',
            'billingMode' => 'daily',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['clientSlug']);
});

test('rejects an end client equal to the billing client', function (): void {
    $user = User::factory()->create();
    $client = Client::factory()->for($user)->create();

    $this->actingAs($user)
        ->postJson('/api/missions', [
            'clientSlug' => $client->slug,
            'name' => 'M',
            'billingMode' => 'daily',
            'endClientSlug' => $client->slug,
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['endClientSlug']);
});

test('returns 401 for guests', function (): void {
    $this->postJson('/api/missions', [])->assertUnauthorized();
});
