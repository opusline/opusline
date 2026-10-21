<?php

declare(strict_types=1);

use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Bank\Models\BankAccount;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

/**
 * A debit on one account and the same credit on another, paired by the import.
 *
 * @return array{0: BankMovement, 1: BankMovement, 2: BankAccount}
 */
function pairedTransferOf(User $user, string $creditLine = '12/08/2026;VIR SEPA REF 2026041;1 980,00'): array
{
    $shine = bankAccountFor($user);
    $swan = bankAccountFor($user);
    $debit = bankMovementFor($user, bankStatementOn($shine), fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(198_000)->on('2026-08-10'));

    importBankCsv($user, $swan, $creditLine)->assertCreated();

    $credit = $swan->movements()->sole();
    expect($debit->refresh()->transfer_counterpart_id)->toBe($credit->id);

    return [$debit, $credit, $swan];
}

test('undoing a pairing frees both sides', function (string $side): void {
    $user = User::factory()->create();
    [$debit, $credit] = pairedTransferOf($user);
    $undone = $side === 'debit' ? $debit : $credit;

    $this->actingAs($user)
        ->deleteJson("/api/bank/movements/{$undone->id}/transfer-pairing")
        ->assertOk()
        ->assertJsonPath('movements.0.isInternalTransfer', false)
        ->assertJsonPath('movements.1.isInternalTransfer', false);

    expect($debit->refresh()->transfer_counterpart_id)->toBeNull()
        ->and($credit->refresh()->transfer_counterpart_id)->toBeNull()
        ->and($user->bankMovements()->unlinkedDebits()->whereKey($debit->id)->exists())->toBeTrue();
})->with(['debit', 'credit']);

test('the freed credit meets its invoice right away', function (): void {
    $user = User::factory()->create();
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['number' => '2026-041']));
    [, $credit] = pairedTransferOf($user);

    $this->actingAs($user)
        ->deleteJson("/api/bank/movements/{$credit->id}/transfer-pairing")
        ->assertOk()
        ->assertJsonPath('pendingMatches.0.movementId', $credit->id)
        ->assertJsonPath('pendingMatches.0.invoice.id', $invoice->id);
});

test('a later import never pairs the undone movements again', function (): void {
    $user = User::factory()->create();
    [$debit, $credit, $swan] = pairedTransferOf($user);

    $this->actingAs($user)->deleteJson("/api/bank/movements/{$debit->id}/transfer-pairing")->assertOk();
    importBankCsv($user, $swan, '12/08/2026;VIR SEPA REF 2026041;1 980,00')->assertCreated();

    expect($debit->refresh()->transfer_counterpart_id)->toBeNull()
        ->and($credit->refresh()->transfer_counterpart_id)->toBeNull();
});

test('refuses to undo a movement that is not paired', function (): void {
    $user = User::factory()->create();
    $movement = bankMovementFor($user);

    $this->actingAs($user)
        ->deleteJson("/api/bank/movements/{$movement->id}/transfer-pairing")
        ->assertConflict();

    expect($movement->refresh()->transfer_pairing_refused)->toBeFalse();
});

test('another user\'s pairing is invisible and untouched', function (): void {
    $owner = User::factory()->create();
    [$debit, $credit] = pairedTransferOf($owner);

    $this->actingAs(User::factory()->create())
        ->deleteJson("/api/bank/movements/{$debit->id}/transfer-pairing")
        ->assertNotFound();

    expect($debit->refresh()->transfer_counterpart_id)->toBe($credit->id);
});
