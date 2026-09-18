<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

function avisPayload(array $overrides = []): array
{
    return settingsPayload([
        'referenceTaxIncome' => ['amount' => 3_150_000, 'currency' => 'EUR'],
        'referenceTaxIncomeYear' => 2025,
        'taxHouseholdQuarterParts' => 6,
        'incomeTaxRateBp' => 750,
        ...$overrides,
    ]);
}

test('saves what the avis d\'imposition says about the household', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', avisPayload())
        ->assertOk()
        ->assertJsonPath('referenceTaxIncome.amount', 3_150_000)
        ->assertJsonPath('referenceTaxIncomeYear', 2025)
        ->assertJsonPath('taxHouseholdQuarterParts', 6)
        ->assertJsonPath('incomeTaxRateBp', 750);
});

test('saves a revenu fiscal de référence of zero, as a year spent abroad prints it', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', avisPayload([
            'referenceTaxIncome' => ['amount' => 0, 'currency' => 'EUR'],
            'referenceTaxIncomeYear' => 2024,
        ]))
        ->assertOk()
        ->assertJsonPath('referenceTaxIncome.amount', 0)
        ->assertJsonPath('referenceTaxIncomeYear', 2024)
        ->assertJsonPath('taxHouseholdQuarterParts', 6);
});

test('refuses a negative revenu fiscal de référence', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', avisPayload([
            'referenceTaxIncome' => ['amount' => -1, 'currency' => 'EUR'],
        ]))
        ->assertJsonValidationErrorFor('referenceTaxIncome.amount');
});

test('asks for the year and the parts that go with a revenu fiscal de référence', function (string $missing): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', avisPayload([$missing => null]))
        ->assertJsonValidationErrorFor($missing);
})->with(['referenceTaxIncomeYear', 'taxHouseholdQuarterParts']);

test('refuses a household smaller than one part', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', avisPayload(['taxHouseholdQuarterParts' => 3]))
        ->assertJsonValidationErrorFor('taxHouseholdQuarterParts');
});

test('drops the avis figures when the business moves abroad', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', avisPayload(['businessCountry' => 'BE']))
        ->assertOk()
        ->assertJsonPath('referenceTaxIncome', null)
        ->assertJsonPath('referenceTaxIncomeYear', null)
        ->assertJsonPath('taxHouseholdQuarterParts', null)
        ->assertJsonPath('incomeTaxRateBp', null);
});

test('refuses a revenu fiscal de référence in another currency than the account', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', avisPayload([
            'referenceTaxIncome' => ['amount' => 3_150_000, 'currency' => 'USD'],
        ]))
        ->assertJsonValidationErrorFor('referenceTaxIncome.currency');
});
