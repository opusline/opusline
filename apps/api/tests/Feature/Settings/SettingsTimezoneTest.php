<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

test('defaults a new account to the Paris timezone and a seven-hour workday', function (): void {
    $settings = User::factory()->create()->settings()->sole();

    expect($settings->timezone)->toBe('Europe/Paris')
        ->and($settings->workday_minutes)->toBe(420);
});

test('saves the timezone and the workday length with the other settings', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'timezone' => 'Pacific/Noumea',
            'workdayMinutes' => 480,
        ]))
        ->assertOk()
        ->assertJsonPath('timezone', 'Pacific/Noumea')
        ->assertJsonPath('workdayMinutes', 480);

    $this->assertDatabaseHas('user_settings', [
        'user_id' => $user->id,
        'timezone' => 'Pacific/Noumea',
        'workday_minutes' => 480,
    ]);
});

test('rejects an unknown timezone or an unworkable workday', function (array $overrides, string $field): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', settingsPayload($overrides))
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$field]);
})->with([
    'a made-up timezone' => [['timezone' => 'Mars/Olympus'], 'timezone'],
    'a workday under an hour' => [['workdayMinutes' => 45], 'workdayMinutes'],
    'a workday past a full day' => [['workdayMinutes' => 1_500], 'workdayMinutes'],
]);

test('accepts a payment dated on the account today that UTC has not reached yet', function (): void {
    // 23:30 UTC on 31 December is already 00:30 on 1 January in Paris. Recording
    // the payment on the user's own date must not be refused as "in the future" —
    // that is the URSSAF/TVA declaration-period bug this setting exists to fix.
    $this->travelTo(CarbonImmutable::parse('2026-12-31 23:30:00', 'UTC'));

    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/pay", ['paidOn' => '2027-01-01'])
        ->assertOk()
        ->assertJsonPath('invoice.paidOn', '2027-01-01');
});

test('still refuses a date beyond the account today', function (): void {
    $this->travelTo(CarbonImmutable::parse('2026-12-31 23:30:00', 'UTC'));

    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/pay", ['paidOn' => '2027-01-02'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['paidOn']);
});

test('judges "in the future" against the timezone the account chose', function (): void {
    $this->travelTo(CarbonImmutable::parse('2026-12-31 23:30:00', 'UTC'));

    $user = User::factory()->create();
    $user->settings()->sole()->update(['timezone' => 'UTC']);
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent());

    $this->actingAs($user)
        ->postJson("/api/invoices/{$invoice->id}/pay", ['paidOn' => '2027-01-01'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['paidOn']);
});

test('dates a CRA sent after midnight in Paris into the new month', function (): void {
    $this->travelTo(CarbonImmutable::parse('2026-08-31 22:30:00', 'UTC'));

    $user = User::factory()->create();
    $mission = craMissionOwnedBy($user);
    $cra = craDays(
        craOwnedBy($user, $mission, fn ($factory) => $factory->forMonth('2026-08')),
        ['2026-08-24' => 10_000],
    );

    $this->actingAs($user)
        ->postJson("/api/cras/{$cra->id}/send")
        ->assertOk()
        ->assertJsonPath('cra.sentOn', '2026-09-01');
});

test('values a day fraction against the account workday', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['workday_minutes' => 480]);
    $mission = missionOwnedBy($user);

    $this->actingAs($user)
        ->postJson('/api/time-entries', [
            'missionId' => $mission->id,
            'date' => '2026-08-03',
            'durationMinutes' => 240,
            'note' => null,
        ])
        ->assertCreated()
        // Half-day rounding on an eight-hour workday: four hours are exactly half.
        ->assertJsonPath('valuedDayFraction', 0.5);
});
