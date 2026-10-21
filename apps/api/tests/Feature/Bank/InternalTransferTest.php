<?php

declare(strict_types=1);

use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('pairs a debit on one account with the same credit on another two days later', function (): void {
    $user = User::factory()->create();
    $shine = bankAccountFor($user);
    $swan = bankAccountFor($user);
    $debit = bankMovementFor($user, bankStatementOn($shine), fn (BankMovementFactory $factory): BankMovementFactory => $factory
        ->debit(50_000)
        ->on('2026-08-10')
        ->state(['label' => 'VIR VERS SWAN ATELIERS RUCHE']));

    importBankCsv($user, $swan, '12/08/2026;VIR DE SHINE ATELIERS RUCHE;500,00')->assertCreated();

    $credit = $swan->movements()->sole();
    expect($debit->refresh()->transfer_counterpart_id)->toBe($credit->id)
        ->and($credit->transfer_counterpart_id)->toBe($debit->id);

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('movements.0.id', $credit->id)
        ->assertJsonPath('movements.0.isInternalTransfer', true)
        ->assertJsonPath('movements.1.id', $debit->id)
        ->assertJsonPath('movements.1.isInternalTransfer', true)
        ->assertJsonPath('hasUnlinkedCredits', false);
});

test('a paired debit is no expense left to explain', function (): void {
    $user = User::factory()->create();
    $shine = bankAccountFor($user);
    $swan = bankAccountFor($user);
    bankMovementFor($user, bankStatementOn($shine), fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(50_000)->on('2026-08-10'));

    importBankCsv($user, $swan, '12/08/2026;VIR DE SHINE;500,00')->assertCreated();

    expect($user->bankMovements()->unlinkedDebits()->exists())->toBeFalse();
});

test('a paired credit raises no invoice suggestion, even at a sent invoice\'s amount and reference', function (): void {
    $user = User::factory()->create();
    $shine = bankAccountFor($user);
    $swan = bankAccountFor($user);
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['number' => '2026-041']));
    bankMovementFor($user, bankStatementOn($shine), fn (BankMovementFactory $factory): BankMovementFactory => $factory->debit(198_000)->on('2026-08-07'));

    importBankCsv($user, $swan, '08/08/2026;VIR SEPA REF 2026041;1 980,00')
        ->assertCreated()
        ->assertJsonPath('suggestionCount', 0)
        ->assertJsonPath('account.pendingMatches', [])
        ->assertJsonPath('account.hasUnlinkedCredits', false);
});

test('pairing withdraws the suggestion a credit raised before its debit came in', function (): void {
    $user = User::factory()->create();
    $shine = bankAccountFor($user);
    $swan = bankAccountFor($user);
    invoiceOwnedBy($user, configure: fn ($factory) => $factory->sent()->state(['number' => '2026-041']));

    importBankCsv($user, $swan, '08/08/2026;VIR SEPA REF 2026041;1 980,00')
        ->assertCreated()
        ->assertJsonPath('suggestionCount', 1);

    importBankCsv($user, $shine, '09/08/2026;VIR VERS SWAN;-1 980,00')
        ->assertCreated()
        ->assertJsonPath('account.pendingMatches', []);

    expect($swan->movements()->sole()->transfer_counterpart_id)->toBe($shine->movements()->sole()->id)
        ->and($user->bankMatches()->exists())->toBeFalse();
});

test('pairs only within three days', function (string $debitedOn, bool $isPaired): void {
    $user = User::factory()->create();
    $shine = bankAccountFor($user);
    $swan = bankAccountFor($user);
    $credit = bankMovementFor($user, bankStatementOn($swan), fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(50_000)->on('2026-08-12'));

    importBankCsv($user, $shine, "{$debitedOn};VIR VERS SWAN;-500,00")->assertCreated();

    expect($credit->refresh()->transfer_counterpart_id !== null)->toBe($isPaired)
        ->and($shine->movements()->sole()->transfer_counterpart_id !== null)->toBe($isPaired);
})->with([
    'three days apart' => ['09/08/2026', true],
    'four days apart' => ['08/08/2026', false],
]);

test('never pairs two movements of the same account', function (): void {
    $user = User::factory()->create();
    $shine = bankAccountFor($user);
    bankAccountFor($user);
    $credit = bankMovementFor($user, bankStatementOn($shine), fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(50_000)->on('2026-08-12'));

    importBankCsv($user, $shine, '11/08/2026;CARTE LUNAPRINT;-500,00')->assertCreated();

    expect($credit->refresh()->transfer_counterpart_id)->toBeNull()
        ->and($shine->movements()->whereNotNull('transfer_counterpart_id')->exists())->toBeFalse();
});

test('a credit already explained by an invoice is never paired', function (): void {
    $user = User::factory()->create();
    $shine = bankAccountFor($user);
    $swan = bankAccountFor($user);
    $invoice = invoiceOwnedBy($user, configure: fn ($factory) => $factory->paid('2026-08-12'));
    $credit = bankMovementFor($user, bankStatementOn($swan), fn (BankMovementFactory $factory): BankMovementFactory => $factory
        ->credit(198_000)
        ->on('2026-08-12')
        ->state(['invoice_id' => $invoice->id]));

    importBankCsv($user, $shine, '11/08/2026;VIR VERS SWAN;-1 980,00')->assertCreated();

    expect($credit->refresh()->transfer_counterpart_id)->toBeNull();
});
