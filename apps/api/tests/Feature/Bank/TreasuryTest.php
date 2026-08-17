<?php

declare(strict_types=1);

use App\Domain\Bank\Models\TreasuryTransfer;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/** An account whose balance was typed by hand on the given date. */
function accountWithBalance(int $cents, string $recordedOn = '2026-08-10'): User
{
    $user = User::factory()->create();

    $user->settings()->sole()->update([
        'bank_balance_cents' => $cents,
        'bank_balance_recorded_on' => $recordedOn,
    ]);

    return $user;
}

test('requires authentication', function (): void {
    $this->getJson('/api/treasury')->assertUnauthorized();
});

test('offers nothing while no balance is known', function (): void {
    $this->actingAs(User::factory()->create())
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('balance', null)
        ->assertJsonPath('transferable.amount', 0);
});

test('offers the balance when nothing is provisioned against it', function (): void {
    // A fresh account is under the franchise en base and has no buffer set, so
    // the provisions total is zero and the whole balance is safe to move.
    $this->actingAs(accountWithBalance(500_000))
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('balance.amount.amount', 500_000)
        ->assertJsonPath('provisions.total.amount', 0)
        ->assertJsonPath('transferable.amount', 500_000)
        ->assertJsonPath('shortfall', null);
});

test('keeps the configured buffer out of what it offers', function (): void {
    $user = accountWithBalance(500_000);
    $user->settings()->sole()->update(['treasury_buffer_cents' => 200_000]);

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('provisions.buffer.amount', 200_000)
        ->assertJsonPath('transferable.amount', 300_000);
});

test('records a transfer and stops offering the money again', function (): void {
    $user = accountWithBalance(500_000, '2026-08-10');

    $this->actingAs($user)
        ->postJson('/api/treasury/transfers', [
            'amount' => ['amount' => 150_000, 'currency' => 'EUR'],
            'transferredOn' => '2026-08-12',
            'note' => 'Salaire août',
        ])
        ->assertCreated()
        // The balance still predates the transfer, so the money is spoken for.
        ->assertJsonPath('pendingTransfers.amount', 150_000)
        ->assertJsonPath('transferable.amount', 350_000)
        ->assertJsonPath('transfers.0.note', 'Salaire août')
        ->assertJsonPath('transfers.0.isSettled', false);
});

test('stops deducting a transfer the balance has caught up with', function (): void {
    $user = accountWithBalance(500_000, '2026-08-10');

    TreasuryTransfer::factory()->for($user)->create([
        'transferred_on' => '2026-08-03',
        'amount_cents' => 150_000,
    ]);

    // The balance is dated after the transfer, so it already lost the money.
    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('pendingTransfers.amount', 0)
        ->assertJsonPath('transferable.amount', 500_000)
        ->assertJsonPath('transfers.0.isSettled', true);
});

test('settles a transfer dated the same day as the balance', function (): void {
    $user = accountWithBalance(500_000, '2026-08-10');

    TreasuryTransfer::factory()->for($user)->create([
        'transferred_on' => '2026-08-10',
        'amount_cents' => 150_000,
    ]);

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('transfers.0.isSettled', true)
        ->assertJsonPath('pendingTransfers.amount', 0);
});

test('reports a shortfall instead of offering a negative amount', function (): void {
    $user = accountWithBalance(100_000);
    $user->settings()->sole()->update(['treasury_buffer_cents' => 300_000]);

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('transferable.amount', 0)
        ->assertJsonPath('shortfall.amount', -200_000);
});

test('lists transfers newest first', function (): void {
    $user = accountWithBalance(900_000);

    foreach (['2026-08-01', '2026-08-15', '2026-08-08'] as $date) {
        TreasuryTransfer::factory()->for($user)->create([
            'transferred_on' => $date,
            'amount_cents' => 10_000,
        ]);
    }

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('transfers.0.transferredOn', '2026-08-15')
        ->assertJsonPath('transfers.1.transferredOn', '2026-08-08')
        ->assertJsonPath('transfers.2.transferredOn', '2026-08-01');
});

test('refuses a transfer dated in the future', function (): void {
    $this->actingAs(accountWithBalance(500_000))
        ->postJson('/api/treasury/transfers', [
            'amount' => ['amount' => 10_000, 'currency' => 'EUR'],
            'transferredOn' => '2026-09-01',
        ])
        ->assertJsonValidationErrorFor('transferredOn');
});

test('never reports another account transfers', function (): void {
    $stranger = accountWithBalance(500_000);
    TreasuryTransfer::factory()->for($stranger)->create(['amount_cents' => 10_000]);

    $this->actingAs(accountWithBalance(500_000))
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('transfers', []);
});
