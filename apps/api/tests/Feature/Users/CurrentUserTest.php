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
            'releaseNotesSeenVersion' => config()->string('app.version'),
            'locale' => Locale::en_US->value,
            'dateFormat' => DateFormat::DayMonthYear->value,
            'currency' => Currency::EUR->value,
            'businessCountry' => 'FR',
            'hasFrenchFiscality' => true,
            'vatLiable' => false,
            'effectiveVatRateBp' => 0,
            'timezone' => 'Europe/Paris',
            'workdayMinutes' => 420,
            'effectiveContributionRateBp' => 2560,
        ]);
});

test('the current user carries the account rate, not a national default', function (): void {
    // An ACRE account pays roughly 15 % less; the mission projection prices its
    // URSSAF provision from this, so a constant in the browser is wrong for them.
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'contribution_rate_bp' => 1230,
        'liberating_payment' => true,
        'liberating_payment_rate_bp' => 220,
    ]);

    $this->actingAs($user)
        ->getJson('/api/user')
        ->assertOk()
        ->assertJsonPath('effectiveContributionRateBp', 1450);
});

test('guests receive a 401 json response', function (): void {
    $this->getJson('/api/user')->assertUnauthorized();
});
