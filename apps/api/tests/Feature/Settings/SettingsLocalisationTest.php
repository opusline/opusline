<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\DateFormat;
use App\Domain\Settings\Enums\Locale;
use App\Domain\Users\Models\User;

test('defaults a new account to French formatting and the day-first layout', function (): void {
    $settings = User::factory()->create()->settings()->sole();

    expect($settings->locale)->toBe(Locale::fr_FR)
        ->and($settings->date_format)->toBe(DateFormat::DayMonthYear);
});

test('saves the locale and the date format with the other settings', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'locale' => Locale::en_US->value,
            'dateFormat' => DateFormat::YearMonthDay->value,
        ]))
        ->assertOk()
        ->assertJsonPath('locale', Locale::en_US->value)
        ->assertJsonPath('dateFormat', DateFormat::YearMonthDay->value);

    $this->assertDatabaseHas('user_settings', [
        'user_id' => $user->id,
        'locale' => Locale::en_US->value,
        'date_format' => DateFormat::YearMonthDay->value,
    ]);
});

test('the current user carries the localisation preferences', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'locale' => Locale::en_US,
        'date_format' => DateFormat::YearMonthDay,
    ]);

    $this->actingAs($user)
        ->getJson('/api/user')
        ->assertOk()
        ->assertJsonPath('locale', Locale::en_US->value)
        ->assertJsonPath('dateFormat', DateFormat::YearMonthDay->value);
});

test('changing the locale switches the response language on the next request', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload(['locale' => Locale::en_US->value]))
        ->assertOk();

    // A fresh instance, because in-process requests reuse the acting user and
    // its warmed settings relation; a real client rehydrates every request.
    $response = $this->actingAs(User::sole())
        ->putJson('/api/settings', settingsPayload(['workdayMinutes' => 0]))
        ->assertUnprocessable();

    expect($response->json('errors.workdayMinutes.0'))->toContain('workday length');
});

test('rejects an unknown locale or date format', function (array $overrides, string $field): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', settingsPayload($overrides))
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$field]);
})->with([
    'an unsupported locale' => [['locale' => 'xx-XX'], 'locale'],
    'an unknown date format' => [['dateFormat' => 99], 'dateFormat'],
]);
