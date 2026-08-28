<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Actions\CreateMission;
use App\Domain\Missions\Data\CreateMissionData;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Shared\Enums\Currency;
use App\Domain\Users\Models\User;
use Illuminate\Validation\ValidationException;

test('changes the account currency on a fresh account', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/settings/currency', ['currency' => Currency::USD->value])
        ->assertOk()
        ->assertJsonPath('currency', Currency::USD->value)
        ->assertJsonPath('currencyLocked', false);

    $this->assertDatabaseHas('user_settings', [
        'user_id' => $user->id,
        'currency' => Currency::USD->value,
    ]);
});

test('the current user carries the account currency', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['currency' => Currency::USD]);

    $this->actingAs($user)
        ->getJson('/api/user')
        ->assertOk()
        ->assertJsonPath('currency', Currency::USD->value);
});

test('refuses a currency outside the supported list', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->putJson('/api/settings/currency', ['currency' => 'JPY'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['currency']);
});

test('locks the currency once a mission carries a rate', function (): void {
    $user = User::factory()->create();
    missionOwnedBy($user);

    $this->actingAs($user)
        ->putJson('/api/settings/currency', ['currency' => Currency::USD->value])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['currency']);

    $this->assertDatabaseHas('user_settings', [
        'user_id' => $user->id,
        'currency' => Currency::EUR->value,
    ]);
});

test('locks the currency once an invoice exists', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user);

    $this->actingAs($user)
        ->putJson('/api/settings/currency', ['currency' => Currency::USD->value])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['currency']);
});

test('locks the currency once a fixed mission carries only a reference daily rate', function (): void {
    $user = User::factory()->create();
    missionOwnedBy($user, fn ($factory) => $factory->state([
        'billing_mode' => BillingMode::Fixed,
        'rate_cents' => null,
        'reference_daily_rate_cents' => 55_000,
    ]));

    $this->actingAs($user)
        ->putJson('/api/settings/currency', ['currency' => Currency::USD->value])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['currency']);

    $this->assertDatabaseHas('user_settings', [
        'user_id' => $user->id,
        'currency' => Currency::EUR->value,
    ]);
});

test('an unpriced mission does not lock the currency', function (): void {
    $user = User::factory()->create();
    missionOwnedBy($user, fn ($factory) => $factory->state([
        'billing_mode' => BillingMode::Daily,
        'rate_cents' => null,
    ]));

    $this->actingAs($user)
        ->putJson('/api/settings/currency', ['currency' => Currency::USD->value])
        ->assertOk()
        ->assertJsonPath('currency', Currency::USD->value);
});

test('changing the currency clears the treasury buffer instead of re-denominating it', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['treasury_buffer_cents' => 1_000_000]);

    $this->actingAs($user)
        ->putJson('/api/settings/currency', ['currency' => Currency::USD->value])
        ->assertOk()
        ->assertJsonPath('currency', Currency::USD->value)
        ->assertJsonPath('treasuryBuffer', null);

    $this->assertDatabaseHas('user_settings', [
        'user_id' => $user->id,
        'treasury_buffer_cents' => null,
    ]);
});

test('changing the currency clears the hand-typed bank balance too', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update([
        'bank_balance_cents' => 1_482_000,
        'bank_balance_recorded_on' => '2026-08-10',
    ]);

    $this->actingAs($user)
        ->putJson('/api/settings/currency', ['currency' => Currency::USD->value])
        ->assertOk();

    $this->assertDatabaseHas('user_settings', [
        'user_id' => $user->id,
        'bank_balance_cents' => null,
        'bank_balance_recorded_on' => null,
    ]);
});

test('changing the currency clears the expected CFE too', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['cfe_expected_cents' => 48_000]);

    $this->actingAs($user)
        ->putJson('/api/settings/currency', ['currency' => Currency::USD->value])
        ->assertOk()
        ->assertJsonPath('cfeExpected', null);

    $this->assertDatabaseHas('user_settings', [
        'user_id' => $user->id,
        'cfe_expected_cents' => null,
    ]);
});

test('locks the currency once a bank statement was imported', function (): void {
    $user = User::factory()->create();
    bankStatementOwnedBy($user);

    $this->actingAs($user)
        ->putJson('/api/settings/currency', ['currency' => Currency::USD->value])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['currency']);

    $this->assertDatabaseHas('user_settings', [
        'user_id' => $user->id,
        'currency' => Currency::EUR->value,
    ]);
});

test('an amount written under the lock must match the account currency', function (): void {
    // Request validation reads the currency before the user-row lock is taken;
    // this is the in-transaction re-check that closes the race window.
    $user = User::factory()->create();
    $user->settings()->sole()->update(['currency' => Currency::USD]);
    $client = Client::factory()->for($user)->create();

    $action = app(CreateMission::class);
    $data = CreateMissionData::from([
        'name' => 'Refonte',
        'billingMode' => BillingMode::Daily,
        'rate' => ['amount' => 55_000, 'currency' => 'EUR'],
    ]);

    expect(fn () => $action->handle($user, $client, $data))
        ->toThrow(ValidationException::class);
    $this->assertDatabaseMissing('missions', ['name' => 'Refonte']);
});

test('re-affirming the current currency is allowed even when locked', function (): void {
    $user = User::factory()->create();
    invoiceOwnedBy($user);

    $this->actingAs($user)
        ->putJson('/api/settings/currency', ['currency' => Currency::EUR->value])
        ->assertOk()
        ->assertJsonPath('currency', Currency::EUR->value)
        ->assertJsonPath('currencyLocked', true);
});

test('settings expose the lock so the picker can disable itself', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->getJson('/api/settings')
        ->assertOk()
        ->assertJsonPath('currency', Currency::EUR->value)
        ->assertJsonPath('currencyLocked', false);

    missionOwnedBy($user);

    $this->actingAs($user)
        ->getJson('/api/settings')
        ->assertOk()
        ->assertJsonPath('currencyLocked', true);
});

test('an amount in another currency than the account is refused', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['currency' => Currency::USD]);

    $this->actingAs($user)
        ->putJson('/api/settings', settingsPayload([
            'treasuryBuffer' => ['amount' => 150_000, 'currency' => Currency::EUR->value],
        ]))
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['treasuryBuffer.currency']);
});

test('returns 401 for guests', function (): void {
    $this->putJson('/api/settings/currency', ['currency' => Currency::USD->value])
        ->assertUnauthorized();
});
