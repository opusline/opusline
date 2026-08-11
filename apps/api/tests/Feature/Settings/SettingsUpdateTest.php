<?php

declare(strict_types=1);

use App\Domain\Settings\Enums\UrssafPeriodicity;
use App\Domain\Settings\Enums\VatRegime;
use App\Domain\Shared\Enums\Currency;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Http;

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function settingsPayload(array $overrides = []): array
{
    return array_merge([
        'urssafPeriodicity' => UrssafPeriodicity::Monthly->value,
        'autoRates' => false,
        'acre' => false,
        'contributionRateBp' => 2600,
        'liberatingPayment' => false,
        'liberatingPaymentRateBp' => 220,
        'vatRegime' => VatRegime::FranchiseEnBase->value,
        'defaultPaymentTermsDays' => 45,
        'invoiceNumberFormat' => 'AAAA-NNN',
        'homeAddressSameAsCompany' => true,
    ], $overrides);
}

test('saves the company identity', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'tradeName' => 'Théo Marchand',
            'siret' => '443 061 841 00047',
            'signatureCity' => 'Nantes',
            'contactEmail' => 'theo@marchand.dev',
            'phone' => '06 12 34 56 78',
        ]))
        ->assertOk()
        ->assertJsonPath('tradeName', 'Théo Marchand')
        ->assertJsonPath('siret', '443 061 841 00047')
        ->assertJsonPath('signatureCity', 'Nantes')
        ->assertJsonPath('contactEmail', 'theo@marchand.dev')
        ->assertJsonPath('phone', '06 12 34 56 78');

    $this->assertDatabaseHas('user_settings', [
        'user_id' => $user->id,
        'trade_name' => 'Théo Marchand',
        'signature_city' => 'Nantes',
    ]);
});

test('saves the company address', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', settingsPayload([
            'companyAddressLine1' => '12 rue de Strasbourg',
            'companyAddressLine2' => 'Bâtiment B, 2e étage',
            'companyPostalCode' => '44000',
            'companyCity' => 'Nantes',
        ]))
        ->assertOk()
        ->assertJsonPath('companyAddressLine1', '12 rue de Strasbourg')
        ->assertJsonPath('companyAddressLine2', 'Bâtiment B, 2e étage')
        ->assertJsonPath('companyPostalCode', '44000')
        ->assertJsonPath('companyCity', 'Nantes');
});

test('keeps the personal address separate from the company one', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', settingsPayload([
            'companyCity' => 'Nantes',
            'homeAddressSameAsCompany' => false,
            'homeAddressLine1' => "4 rue Jeanne d'Arc",
            'homePostalCode' => '44000',
            'homeCity' => 'Nantes',
        ]))
        ->assertOk()
        ->assertJsonPath('homeAddressSameAsCompany', false)
        ->assertJsonPath('homeAddressLine1', "4 rue Jeanne d'Arc")
        ->assertJsonPath('homeCity', 'Nantes');
});

test('saves the fiscal settings and recomputes the effective rate', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', settingsPayload([
            'urssafPeriodicity' => UrssafPeriodicity::Quarterly->value,
            'contributionRateBp' => 2450,
            'liberatingPayment' => true,
            'liberatingPaymentRateBp' => 220,
            'vatRegime' => VatRegime::ReelSimplifie->value,
            'vatNumber' => 'FR37 892447118',
        ]))
        ->assertOk()
        ->assertJsonPath('urssafPeriodicity', UrssafPeriodicity::Quarterly->value)
        ->assertJsonPath('contributionRateBp', 2450)
        ->assertJsonPath('liberatingPayment', true)
        ->assertJsonPath('vatRegime', VatRegime::ReelSimplifie->value)
        ->assertJsonPath('vatLiable', true)
        ->assertJsonPath('effectiveContributionRateBp', 2670);
});

test('saves the billing defaults', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', settingsPayload([
            'defaultPaymentTermsDays' => 60,
            'invoiceNumberFormat' => 'AAAAMM-NNN',
        ]))
        ->assertOk()
        ->assertJsonPath('defaultPaymentTermsDays', 60)
        ->assertJsonPath('invoiceNumberFormat', 'AAAAMM-NNN');
});

test('saves the treasury buffer as money', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'treasuryBuffer' => ['amount' => 150_000, 'currency' => Currency::EUR->value],
        ]))
        ->assertOk()
        ->assertJsonPath('treasuryBuffer.amount', 150_000)
        ->assertJsonPath('treasuryBuffer.currency', Currency::EUR->value);

    $this->assertDatabaseHas('user_settings', [
        'user_id' => $user->id,
        'treasury_buffer_cents' => 150_000,
    ]);
});

test('clears the treasury buffer when it is omitted', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['treasury_buffer_cents' => 150_000]);

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload())
        ->assertOk()
        ->assertJsonPath('treasuryBuffer', null);
});

test('rejects an invalid payload', function (array $overrides, string $expectedError): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', settingsPayload($overrides))
        ->assertUnprocessable()
        ->assertJsonValidationErrors([$expectedError]);
})->with([
    'negative contribution rate' => [['contributionRateBp' => -1], 'contributionRateBp'],
    'contribution rate above 100 %' => [['contributionRateBp' => 10_001], 'contributionRateBp'],
    'non integer contribution rate' => [['contributionRateBp' => 'beaucoup'], 'contributionRateBp'],
    'unknown urssaf periodicity' => [['urssafPeriodicity' => 99], 'urssafPeriodicity'],
    'unknown vat regime' => [['vatRegime' => 99], 'vatRegime'],
    'payment terms above a year' => [['defaultPaymentTermsDays' => 400], 'defaultPaymentTermsDays'],
    'negative payment terms' => [['defaultPaymentTermsDays' => -1], 'defaultPaymentTermsDays'],
    'invoice format without a counter' => [['invoiceNumberFormat' => 'AAAA-MM'], 'invoiceNumberFormat'],
    'invoice format with an unknown token' => [['invoiceNumberFormat' => 'NNN-<client>'], 'invoiceNumberFormat'],
    'malformed siret' => [['siret' => '123'], 'siret'],
    'malformed vat number' => [['vatNumber' => 'nope'], 'vatNumber'],
    'malformed contact email' => [['contactEmail' => 'not-an-email'], 'contactEmail'],
]);

test('never touches another account settings', function (): void {
    $other = User::factory()->create();

    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', settingsPayload(['tradeName' => 'Nordlys']))
        ->assertOk();

    expect($other->settings()->sole()->trade_name)->toBeNull();
});

test('returns 401 for guests', function (): void {
    $this->putJson('/api/settings', settingsPayload())->assertUnauthorized();
});

test('re-reads the barème when the saved situation changes', function (): void {
    fakeBareme(ratePercent: 12.8);
    $user = User::factory()->create();
    $user->settings()->sole()->update(['auto_rates' => true, 'contribution_rate_bp' => 2560]);

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'autoRates' => true,
            'acre' => true,
            'businessStartedOn' => now()->subMonths(2)->format('Y-m-d'),
        ]))
        ->assertOk()
        ->assertJsonPath('contributionRateBp', 1280);
});

test('adopts the barème when the official source is switched on', function (): void {
    fakeBareme();
    $user = User::factory()->create();
    $user->settings()->sole()->update(['auto_rates' => false, 'contribution_rate_bp' => 2000]);

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload(['autoRates' => true]))
        ->assertOk()
        ->assertJsonPath('contributionRateBp', 2560);
});

test('leaves the barème alone when the situation is untouched', function (): void {
    Http::fake();
    $user = User::factory()->create();
    $checkedAt = now()->subDays(3);
    $user->settings()->sole()->update([
        'auto_rates' => true,
        'contribution_rate_bp' => 2560,
        'rates_checked_at' => $checkedAt,
    ]);

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'autoRates' => true,
            'tradeName' => 'Nordlys',
        ]))
        ->assertOk();

    Http::assertNothingSent();
    expect($user->settings()->sole()->rates_checked_at->timestamp)->toBe($checkedAt->timestamp);
});

test('saves the settings even when the barème cannot be read', function (): void {
    Http::fake(['*/evaluate' => Http::response(status: 500)]);
    $user = User::factory()->create();
    $user->settings()->sole()->update(['auto_rates' => true, 'contribution_rate_bp' => 2560]);

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'autoRates' => true,
            'acre' => true,
            'businessStartedOn' => now()->subMonths(2)->format('Y-m-d'),
            'tradeName' => 'Nordlys',
        ]))
        ->assertOk()
        ->assertJsonPath('tradeName', 'Nordlys')
        ->assertJsonPath('contributionRateBp', 2560)
        // The rates now belong to the previous situation, so the verification
        // stamp is cleared rather than left standing as if it still applied.
        ->assertJsonPath('ratesCheckedAt', null)
        ->assertJsonPath('ratesYear', null);
});

test('refuses ACRE without a start date', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', settingsPayload(['acre' => true]))
        ->assertJsonValidationErrors('businessStartedOn');
});

test('keeps the barème rates out of reach while the official source is on', function (): void {
    Http::fake();
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'auto_rates' => true,
        'contribution_rate_bp' => 2560,
        'liberating_payment_rate_bp' => 330,
    ]);

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'autoRates' => true,
            'contributionRateBp' => 100,
            'liberatingPaymentRateBp' => 100,
        ]))
        ->assertOk()
        ->assertJsonPath('contributionRateBp', 2560)
        ->assertJsonPath('liberatingPaymentRateBp', 330);
});

test('hands both rates back when the official source is switched off', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['auto_rates' => true]);

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'autoRates' => false,
            'contributionRateBp' => 2200,
            'liberatingPaymentRateBp' => 100,
        ]))
        ->assertOk()
        ->assertJsonPath('contributionRateBp', 2200)
        ->assertJsonPath('liberatingPaymentRateBp', 100);
});
