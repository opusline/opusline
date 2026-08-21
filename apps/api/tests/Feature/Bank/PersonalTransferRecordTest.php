<?php

declare(strict_types=1);

use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Bank\Factories\BankStatementFactory;
use App\Domain\Bank\Factories\PersonalTransferFactory;
use App\Domain\Users\Models\User;
use Illuminate\Testing\TestResponse;

beforeEach(fn () => freezeTodayAtUtcNoon());

function recordTransfer(User $user, string $on, int $cents = 120_000, ?string $note = 'Salaire'): TestResponse
{
    return test()->actingAs($user)->postJson('/api/treasury/transfers', [
        'amount' => ['amount' => $cents, 'currency' => 'EUR'],
        'transferredOn' => $on,
        'note' => $note,
    ]);
}

test('records a transfer and hands back the recomputed treasury', function (): void {
    $user = accountWithBankBalance();

    recordTransfer($user, '2026-08-13')
        ->assertCreated()
        ->assertJsonPath('transfers.0.amount.amount', 120_000)
        ->assertJsonPath('transfers.0.transferredOn', '2026-08-13')
        ->assertJsonPath('transfers.0.note', 'Salaire');

    $this->assertDatabaseHas('personal_transfers', [
        'user_id' => $user->id,
        'transferred_on' => '2026-08-13',
        'amount_cents' => 120_000,
        'currency' => 'EUR',
    ]);
});

test('subtracts a transfer the known balance does not show yet', function (): void {
    $user = accountWithBankBalance();

    recordTransfer($user, '2026-08-13')
        ->assertCreated()
        ->assertJsonPath('pendingTransfers.amount', 120_000)
        ->assertJsonPath('balance.amount.amount', 1_000_000)
        ->assertJsonPath('transferable.amount', 880_000)
        ->assertJsonPath('transfers.0.reflectedInBalance', false);
});

test('stops subtracting a transfer once an imported statement covers its date', function (): void {
    $user = accountWithBankBalance();
    recordTransfer($user, '2026-08-13')->assertCreated();

    // The relevé lands: its closing balance is the newer anchor, and it already
    // counts the debit. Deducting the transfer again would show 760 000.
    bankStatementOwnedBy($user, fn (BankStatementFactory $factory): BankStatementFactory => $factory->withClosingBalance(880_000, '2026-08-13'));

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('pendingTransfers.amount', 0)
        ->assertJsonPath('transferable.amount', 880_000)
        ->assertJsonPath('transfers.0.reflectedInBalance', true);
});

test('stops subtracting a transfer once a movement rolls past its date', function (): void {
    $user = accountWithBankBalance();
    recordTransfer($user, '2026-08-12')->assertCreated();

    bankMovementFor($user, configure: fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(120_000)->on('2026-08-12'));

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('pendingTransfers.amount', 0)
        ->assertJsonPath('balance.amount.amount', 880_000)
        ->assertJsonPath('transferable.amount', 880_000);
});

test('never subtracts a transfer dated before the balance was read', function (): void {
    $user = accountWithBankBalance();

    recordTransfer($user, '2026-08-09')
        ->assertCreated()
        ->assertJsonPath('pendingTransfers.amount', 0)
        ->assertJsonPath('transferable.amount', 1_000_000)
        ->assertJsonPath('transfers.0.reflectedInBalance', true);
});

test('subtracts a transfer made the same day the balance was read', function (): void {
    $user = accountWithBankBalance();

    // A typed balance is a snapshot from a moment inside its day, so it cannot
    // vouch for what happened later that day — the flow the screen invites.
    recordTransfer($user, '2026-08-10')
        ->assertCreated()
        ->assertJsonPath('pendingTransfers.amount', 120_000)
        ->assertJsonPath('transferable.amount', 880_000)
        ->assertJsonPath('transfers.0.reflectedInBalance', false);
});

test('lists the transfers newest first', function (): void {
    $user = accountWithBankBalance();

    recordTransfer($user, '2026-08-09', 10_000, 'Acompte')->assertCreated();

    recordTransfer($user, '2026-08-13', 20_000, 'Salaire')
        ->assertCreated()
        ->assertJsonPath('transfers.0.note', 'Salaire')
        ->assertJsonPath('transfers.1.note', 'Acompte');
});

test('refuses a transfer dated in the future', function (): void {
    recordTransfer(accountWithBankBalance(), '2026-08-14')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('transferredOn');
});

test('refuses a transfer of zero', function (): void {
    recordTransfer(accountWithBankBalance(), '2026-08-13', 0)
        ->assertUnprocessable()
        ->assertJsonValidationErrors('amount.amount');
});

test('refuses a transfer in a currency the account does not use', function (): void {
    $user = accountWithBankBalance();

    $this->actingAs($user)
        ->postJson('/api/treasury/transfers', [
            'amount' => ['amount' => 120_000, 'currency' => 'CHF'],
            'transferredOn' => '2026-08-13',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('amount.currency');
});

test('a recorded transfer locks the account currency', function (): void {
    $user = User::factory()->create();
    personalTransferFor($user, fn (PersonalTransferFactory $factory): PersonalTransferFactory => $factory->on('2026-08-13'));

    expect($user->hasLockedCurrency())->toBeTrue();
});
