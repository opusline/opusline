<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\DateFormat;
use App\Domain\Settings\Enums\Locale;
use App\Domain\Shared\Enums\Currency;
use App\Domain\Users\Enums\Theme;
use App\Domain\Users\Models\User;

test('the current user endpoint returns the authenticated user', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/user')
        ->assertOk()
        ->assertExactJson([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'theme' => Theme::System->value,
            'locale' => Locale::en_US->value,
            'dateFormat' => DateFormat::DayMonthYear->value,
            'currency' => Currency::EUR->value,
            'businessCountry' => 'FR',
            'hasFrenchFiscality' => true,
            'timezone' => 'Europe/Paris',
            'workdayMinutes' => 420,
        ]);
});

test('guests receive a 401 json response', function (): void {
    $this->getJson('/api/user')->assertUnauthorized();
});
