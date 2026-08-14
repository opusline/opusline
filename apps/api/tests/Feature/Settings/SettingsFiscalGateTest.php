<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Users\Models\User;

test('moving the business out of France strips the French fiscal machinery', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'businessCountry' => 'DE',
            'autoRates' => true,
            'acre' => true,
            'businessStartedOn' => '2026-01-01',
            'liberatingPayment' => true,
            'vatRegime' => VatRegime::FranchiseEnBase->value,
            'defaultVatRateBp' => 1900,
        ]))
        ->assertOk()
        ->assertJsonPath('businessCountry', 'DE')
        ->assertJsonPath('hasFrenchFiscality', false)
        ->assertJsonPath('autoRates', false)
        ->assertJsonPath('acre', false)
        ->assertJsonPath('liberatingPayment', false)
        ->assertJsonPath('vatRegime', VatRegime::ReelNormal->value)
        ->assertJsonPath('effectiveVatRateBp', 1900);
});

test('a French business keeps its fiscal choices', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'liberatingPayment' => true,
            'vatRegime' => VatRegime::FranchiseEnBase->value,
        ]))
        ->assertOk()
        ->assertJsonPath('businessCountry', 'FR')
        ->assertJsonPath('hasFrenchFiscality', true)
        ->assertJsonPath('liberatingPayment', true)
        ->assertJsonPath('vatRegime', VatRegime::FranchiseEnBase->value);
});

test('a euro account abroad still loses the French machinery', function (): void {
    // Invoicing in euros proves nothing about the régime: a freelance in
    // Germany bills EUR and URSSAF does not exist for them.
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'businessCountry' => 'DE',
            'autoRates' => true,
        ]))
        ->assertOk()
        ->assertJsonPath('currency', 'EUR')
        ->assertJsonPath('hasFrenchFiscality', false)
        ->assertJsonPath('autoRates', false);
});

test('a foreign payload asking for official rates still keeps its submitted rates', function (): void {
    // autoRates is forced off abroad; the rate-preservation branches must agree
    // with the stored flag or the submitted figures would be silently dropped.
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'businessCountry' => 'DE',
            'autoRates' => true,
            'contributionRateBp' => 1500,
        ]))
        ->assertOk()
        ->assertJsonPath('autoRates', false)
        ->assertJsonPath('contributionRateBp', 1500);
});

test('rejects a malformed country', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', settingsPayload(['businessCountry' => 'France']))
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['businessCountry']);
});

test('the official rates cannot be refreshed for a business abroad', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'business_country' => 'DE',
        'auto_rates' => true,
    ]);

    $this->actingAs($user)
        ->postJson('/api/settings/rates/refresh')
        ->assertConflict();
});
