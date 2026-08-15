<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\Locale;
use App\Domain\Users\Models\User;

test('validation messages carry the localized field name, not the camelCase key', function (Locale $locale, string $fieldName): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['locale' => $locale]);

    $response = $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload(['workdayMinutes' => 0]))
        ->assertUnprocessable();

    expect($response->json('errors.workdayMinutes.0'))
        ->toContain($fieldName)
        ->not->toContain('workdayMinutes')
        ->not->toContain('workday minutes');
})->with([
    'French' => [Locale::fr_FR, 'durée de journée'],
    'English' => [Locale::en_US, 'workday length'],
]);
