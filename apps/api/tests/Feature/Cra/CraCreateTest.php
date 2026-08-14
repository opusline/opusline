<?php

declare(strict_types=1);

use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Users\Models\User;

test('opens a month pre-filled from the time tracked on the mission', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    trackedDay($user, $mission, '2026-07-06');
    trackedDay($user, $mission, '2026-07-07', minutes: 210);

    $this->actingAs($user)
        ->postJson('/api/cras', ['missionId' => $mission->id, 'month' => '2026-07'])
        ->assertCreated()
        ->assertJsonPath('cra.month', '2026-07')
        ->assertJsonPath('cra.status', CraStatus::Draft->value)
        ->assertJsonPath('cra.totalDays', 1.5)
        ->assertJsonPath('cra.trackedDays', 1.5)
        ->assertJsonPath('cra.differenceDays', 0)
        ->assertJsonPath('cra.dirty', false)
        ->assertJsonPath('cra.editable', true);

    $this->assertDatabaseHas('cras', [
        'user_id' => $user->id,
        'mission_id' => $mission->id,
        'month' => '2026-07-01',
        'status' => CraStatus::Draft->value,
    ]);
    $this->assertDatabaseHas('cra_days', ['date' => '2026-07-06', 'day_fraction_bp' => 10_000]);
    $this->assertDatabaseHas('cra_days', ['date' => '2026-07-07', 'day_fraction_bp' => 5_000]);
});

test('sends every calendar day of the month, worked or not', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);

    $response = $this->actingAs($user)
        ->postJson('/api/cras', ['missionId' => $mission->id, 'month' => '2026-07'])
        ->assertCreated();

    expect($response->json('cra.days'))->toHaveCount(31);
    expect($response->json('cra.days.0.date'))->toBe('2026-07-01');
    expect($response->json('cra.days.30.date'))->toBe('2026-07-31');
});

test('marks weekends and public holidays so the grid needs no calendar of its own', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);

    $days = collect($this->actingAs($user)
        ->postJson('/api/cras', ['missionId' => $mission->id, 'month' => '2026-07'])
        ->assertCreated()
        ->json('cra.days'))
        ->keyBy('date');

    expect($days['2026-07-14'])->toMatchArray(['isHoliday' => true, 'holidayName' => 'Fête nationale']);
    expect($days['2026-07-04'])->toMatchArray(['isWeekend' => true, 'isHoliday' => false]);
    expect($days['2026-07-06'])->toMatchArray(['isWeekend' => false, 'isHoliday' => false]);
});

test('greys no French holidays for a business established abroad', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['business_country' => 'CA']);
    $mission = craMissionOwnedBy($user);

    $days = collect($this->actingAs($user)
        ->postJson('/api/cras', ['missionId' => $mission->id, 'month' => '2026-07'])
        ->assertCreated()
        ->json('cra.days'))
        ->keyBy('date');

    expect($days['2026-07-14'])->toMatchArray(['isHoliday' => false, 'holidayName' => null]);
});

test('prices the month at the mission rate', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    trackedDay($user, $mission, '2026-07-06');
    trackedDay($user, $mission, '2026-07-07', minutes: 210);

    $this->actingAs($user)
        ->postJson('/api/cras', ['missionId' => $mission->id, 'month' => '2026-07'])
        ->assertCreated()
        ->assertJsonPath('cra.estimatedAmount.amount', 82_500)
        ->assertJsonPath('cra.estimatedAmount.currency', 'EUR');
});

test('addresses the document to the end client when the mission runs through an ESN', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user, fn ($factory) => $factory->throughEsn('Callisto'));

    $this->actingAs($user)
        ->postJson('/api/cras', ['missionId' => $mission->id, 'month' => '2026-07'])
        ->assertCreated()
        ->assertJsonPath('recipientName', 'Callisto');
});

test('addresses the document to the billing client when there is no end client', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);

    $this->actingAs($user)
        ->postJson('/api/cras', ['missionId' => $mission->id, 'month' => '2026-07'])
        ->assertCreated()
        ->assertJsonPath('recipientName', $mission->client->name);
});

test('refuses a second CRA for the same mission and month', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    craOwnedBy($user, $mission, fn ($factory) => $factory->forMonth('2026-07'));

    $this->actingAs($user)
        ->postJson('/api/cras', ['missionId' => $mission->id, 'month' => '2026-07'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['month']);
});

test('refuses a mission whose client does not ask for a CRA', function (): void {
    $user = User::factory()->create();
    $mission = missionOwnedBy($user);

    $this->actingAs($user)
        ->postJson('/api/cras', ['missionId' => $mission->id, 'month' => '2026-07'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['missionId']);
});

test('refuses a month that has not started', function (): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);

    $this->actingAs($user)
        ->postJson('/api/cras', [
            'missionId' => $mission->id,
            'month' => now()->addMonth()->format('Y-m'),
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['month']);
});

test('rejects an invalid payload', function (array $payload, string $expectedError): void {
    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);

    $this->actingAs($user)
        ->postJson('/api/cras', [...$payload, 'missionId' => $payload['missionId'] ?? $mission->id])
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$expectedError]);
})->with([
    'missing month' => [[], 'month'],
    'a full date instead of a month' => [['month' => '2026-07-01'], 'month'],
    'a month the wrong way round' => [['month' => '07-2026'], 'month'],
    'unknown mission' => [['missionId' => 987_654, 'month' => '2026-07'], 'missionId'],
]);

test('cannot open a CRA on another user mission', function (): void {
    $user = User::factory()->create();
    $stranger = User::factory()->create();
    $mission = craMissionOwnedBy($stranger);

    $this->actingAs($user)
        ->postJson('/api/cras', ['missionId' => $mission->id, 'month' => '2026-07'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['missionId']);
});

test('returns 401 for guests', function (): void {
    $this->postJson('/api/cras', ['missionId' => 1, 'month' => '2026-07'])
        ->assertUnauthorized();
});
