<?php

declare(strict_types=1);

use App\Domain\Bank\Enums\BankBalanceSource;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('records the typed balance as a manual anchor dated today', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/bank/balance', ['balance' => ['amount' => 1_482_000, 'currency' => 'EUR']])
        ->assertOk()
        ->assertJsonPath('balance.amount.amount', 1_482_000)
        ->assertJsonPath('balance.source', BankBalanceSource::Manual->value)
        ->assertJsonPath('balance.asOf', '2026-08-13');

    expect($user->settings()->sole()->bank_balance_cents?->getAmount())->toBe('1482000');
});

test('accepts an overdrawn balance', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/bank/balance', ['balance' => ['amount' => -35_000, 'currency' => 'EUR']])
        ->assertOk()
        ->assertJsonPath('balance.amount.amount', -35_000);
});

test('clears the manual anchor when null is sent', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'bank_balance_cents' => 100_000,
        'bank_balance_recorded_on' => '2026-08-01',
    ]);

    $this->actingAs($user)
        ->putJson('/api/bank/balance', ['balance' => null])
        ->assertOk()
        ->assertJsonPath('balance', null);

    expect($user->settings()->sole()->bank_balance_cents)->toBeNull();
});

test('refuses a balance in another currency', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/bank/balance', ['balance' => ['amount' => 100, 'currency' => 'USD']])
        ->assertStatus(422)
        ->assertJsonValidationErrors('balance.currency');
});

test('requires authentication', function (): void {
    $this->putJson('/api/bank/balance', ['balance' => null])->assertUnauthorized();
});
