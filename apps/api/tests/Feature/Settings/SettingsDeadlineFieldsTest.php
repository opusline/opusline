<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;

test('saves the CFE the commune is expected to bill', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'cfeExpected' => ['amount' => 48_000, 'currency' => 'EUR'],
        ]))
        ->assertOk()
        ->assertJsonPath('cfeExpected.amount', 48_000);
});

test('drops the CFE when the business moves abroad', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)->putJson('/api/settings', settingsPayload([
        'cfeExpected' => ['amount' => 48_000, 'currency' => 'EUR'],
    ]))->assertOk();

    $this->actingAs($user->fresh())
        ->putJson('/api/settings', settingsPayload([
            'businessCountry' => 'BE',
            'cfeExpected' => ['amount' => 48_000, 'currency' => 'EUR'],
        ]))
        ->assertOk()
        ->assertJsonPath('cfeExpected', null);
});

test('refuses an expected CFE in another currency than the account', function (): void {
    $this->actingAs(User::factory()->create())
        ->putJson('/api/settings', settingsPayload([
            'cfeExpected' => ['amount' => 48_000, 'currency' => 'USD'],
        ]))
        ->assertJsonValidationErrorFor('cfeExpected.currency');
});
