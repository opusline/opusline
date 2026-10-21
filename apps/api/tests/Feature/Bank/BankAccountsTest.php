<?php

declare(strict_types=1);

use App\Domain\Bank\Enums\BankBalanceSource;
use App\Domain\Bank\Enums\BankStatementFormat;
use App\Domain\Bank\Factories\BankMovementFactory;
use App\Domain\Bank\Factories\BankStatementFactory;
use App\Domain\Users\Models\User;

beforeEach(fn () => freezeTodayAtUtcNoon());

test('adds up every bank account into the balance, each account showing its own', function (): void {
    $user = User::factory()->create();
    $shine = bankAccountFor($user, fn ($factory) => $factory->state(['name' => 'Shine']));
    $swan = bankAccountFor($user, fn ($factory) => $factory->state(['name' => 'Swan']));
    bankStatementOn($shine, fn (BankStatementFactory $factory): BankStatementFactory => $factory->withClosingBalance(1_482_000, '2026-08-10'));
    bankStatementOn($swan, fn (BankStatementFactory $factory): BankStatementFactory => $factory->withClosingBalance(300_000, '2026-08-12'));

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('balance.amount.amount', 1_782_000)
        ->assertJsonPath('balance.source', BankBalanceSource::Statement->value)
        // The total is only as recent as its oldest part.
        ->assertJsonPath('balance.asOf', '2026-08-10')
        ->assertJsonCount(2, 'accounts')
        ->assertJsonPath('accounts.0.id', $shine->id)
        ->assertJsonPath('accounts.0.name', 'Shine')
        ->assertJsonPath('accounts.0.balance.amount.amount', 1_482_000)
        ->assertJsonPath('accounts.0.isArchived', false)
        ->assertJsonPath('accounts.1.id', $swan->id)
        ->assertJsonPath('accounts.1.balance.amount.amount', 300_000)
        ->assertJsonPath('accounts.1.balance.asOf', '2026-08-12');
});

test('tells which bank account each statement and movement belongs to', function (): void {
    $user = User::factory()->create();
    bankAccountFor($user);
    $swan = bankAccountFor($user);
    bankMovementFor($user, bankStatementOn($swan), fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(12_000)->on('2026-08-10'));

    $this->actingAs($user)
        ->getJson('/api/bank')
        ->assertOk()
        ->assertJsonPath('statements.0.bankAccountId', $swan->id)
        ->assertJsonPath('movements.0.bankAccountId', $swan->id)
        ->assertJsonPath('movements.0.isInternalTransfer', false);
});

test('a file imported into one account does not skip the days another account\'s bank connection holds', function (): void {
    $user = User::factory()->create();
    $synced = bankAccountFor($user);
    $filed = bankAccountFor($user);
    $syncedStatement = bankStatementOn($synced, fn ($factory) => $factory->state([
        'format' => BankStatementFormat::EnableBanking,
        'period_start' => '2026-07-01',
        'period_end' => '2026-08-13',
    ]));
    bankMovementFor($user, $syncedStatement, fn (BankMovementFactory $factory): BankMovementFactory => $factory->credit(10_000)->on('2026-08-05'));

    importBankCsv($user, $filed, '04/08/2026;VIR NORDLYS;50,00', '05/08/2026;VIR NORDLYS;100,00')
        ->assertCreated()
        ->assertJsonPath('lineCount', 2)
        ->assertJsonPath('importedCount', 2);

    expect($filed->movements()->count())->toBe(2)
        ->and($synced->movements()->count())->toBe(1);
});

test('the same file content can be imported into two accounts', function (): void {
    $user = User::factory()->create();
    $shine = bankAccountFor($user);
    $swan = bankAccountFor($user);
    $lines = ['05/08/2026;VIR NORDLYS;100,00', '06/08/2026;VIR CALLISTO;250,00'];

    importBankCsv($user, $shine, ...$lines)->assertCreated()->assertJsonPath('importedCount', 2);
    importBankCsv($user, $swan, ...$lines)->assertCreated()->assertJsonPath('importedCount', 2);
    importBankCsv($user, $swan, ...$lines)->assertCreated()->assertJsonPath('importedCount', 0);

    expect($shine->movements()->count())->toBe(2)
        ->and($swan->movements()->count())->toBe(2);
});

test('a first import opens the account\'s first bank account', function (): void {
    $user = User::factory()->create();

    importBankCsv($user, null, '05/08/2026;VIR NORDLYS;100,00')->assertCreated();

    $account = $user->bankAccounts()->sole();
    expect($user->bankStatements()->sole()->bank_account_id)->toBe($account->id);
});

test('asks which account a file comes from once there are several', function (): void {
    $user = User::factory()->create();
    bankAccountFor($user);
    bankAccountFor($user);

    importBankCsv($user, null, '05/08/2026;VIR NORDLYS;100,00')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('bankAccountId');

    expect($user->bankStatements()->exists())->toBeFalse()
        ->and($user->bankMovements()->exists())->toBeFalse();
});

test('refuses to import into another user\'s bank account', function (): void {
    $user = User::factory()->create();
    bankAccountFor($user);
    $foreign = bankAccountFor(User::factory()->create());

    importBankCsv($user, $foreign, '05/08/2026;VIR NORDLYS;100,00')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('bankAccountId');

    expect($foreign->statements()->exists())->toBeFalse()
        ->and($user->bankStatements()->exists())->toBeFalse();
});

test('a typed balance lands on the account it names only', function (): void {
    $user = User::factory()->create();
    $shine = bankAccountFor($user, fn ($factory) => $factory->withBalance(100_000, '2026-08-01'));
    $swan = bankAccountFor($user);

    $this->actingAs($user)
        ->putJson('/api/bank/balance', ['balance' => ['amount' => 420_000, 'currency' => 'EUR'], 'bankAccountId' => $swan->id])
        ->assertOk()
        ->assertJsonPath('accounts.0.balance.amount.amount', 100_000)
        ->assertJsonPath('accounts.1.balance.amount.amount', 420_000)
        ->assertJsonPath('accounts.1.balance.source', BankBalanceSource::Manual->value)
        ->assertJsonPath('balance.amount.amount', 520_000);

    expect($shine->refresh()->balance_cents?->getAmount())->toBe('100000')
        ->and($shine->balance_recorded_on?->toDateString())->toBe('2026-08-01')
        ->and($swan->refresh()->balance_cents?->getAmount())->toBe('420000')
        ->and($swan->balance_recorded_on?->toDateString())->toBe('2026-08-13');
});

test('asks which account a typed balance was read on once there are several', function (): void {
    $user = User::factory()->create();
    bankAccountFor($user);
    bankAccountFor($user);

    $this->actingAs($user)
        ->putJson('/api/bank/balance', ['balance' => ['amount' => 420_000, 'currency' => 'EUR']])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('bankAccountId');

    expect($user->bankAccounts()->whereNotNull('balance_cents')->exists())->toBeFalse();
});

test('refuses a typed balance on another user\'s bank account', function (): void {
    $user = User::factory()->create();
    $foreign = bankAccountFor(User::factory()->create());

    $this->actingAs($user)
        ->putJson('/api/bank/balance', ['balance' => ['amount' => 420_000, 'currency' => 'EUR'], 'bankAccountId' => $foreign->id])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('bankAccountId');

    expect($foreign->refresh()->balance_cents)->toBeNull();
});

test('renames a bank account', function (): void {
    $user = User::factory()->create();
    $account = bankAccountFor($user);

    $this->actingAs($user)
        ->putJson("/api/bank/accounts/{$account->id}", ['name' => 'Swan', 'archived' => false])
        ->assertOk()
        ->assertJsonPath('accounts.0.name', 'Swan');

    expect($account->refresh()->name)->toBe('Swan');
});

test('an empty name brings the default label back', function (): void {
    $user = User::factory()->create();
    $account = bankAccountFor($user, fn ($factory) => $factory->state(['name' => 'Swan']));

    $this->actingAs($user)
        ->putJson("/api/bank/accounts/{$account->id}", ['name' => '   ', 'archived' => false])
        ->assertOk()
        ->assertJsonPath('accounts.0.name', null);
});

test('archives a closed bank account and keeps its history', function (): void {
    $user = User::factory()->create();
    $account = bankAccountFor($user);
    bankMovementFor($user, bankStatementOn($account));

    $this->actingAs($user)
        ->putJson("/api/bank/accounts/{$account->id}", ['name' => null, 'archived' => true])
        ->assertOk()
        ->assertJsonPath('accounts.0.isArchived', true);

    expect($account->refresh()->archived_at)->not->toBeNull()
        ->and($account->movements()->count())->toBe(1);
});

test('reopens an archived bank account', function (): void {
    $user = User::factory()->create();
    $account = bankAccountFor($user, fn ($factory) => $factory->archived());

    $this->actingAs($user)
        ->putJson("/api/bank/accounts/{$account->id}", ['name' => null, 'archived' => false])
        ->assertOk()
        ->assertJsonPath('accounts.0.isArchived', false);

    expect($account->refresh()->archived_at)->toBeNull();
});

test('refuses to archive a bank account a connection still syncs', function (): void {
    $user = User::factory()->create();
    $connection = connectedBankFor($user);

    $this->actingAs($user)
        ->putJson("/api/bank/accounts/{$connection->bank_account_id}", ['name' => null, 'archived' => true])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('archived');

    expect($user->bankAccounts()->sole()->archived_at)->toBeNull();
});

test('requires the archived flag', function (): void {
    $user = User::factory()->create();
    $account = bankAccountFor($user);

    $this->actingAs($user)
        ->putJson("/api/bank/accounts/{$account->id}", ['name' => 'Swan'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('archived');
});

test('another user\'s bank account is invisible and untouched', function (): void {
    $user = User::factory()->create();
    $foreign = bankAccountFor(User::factory()->create(), fn ($factory) => $factory->state(['name' => 'Shine']));

    $this->actingAs($user)
        ->putJson("/api/bank/accounts/{$foreign->id}", ['name' => 'Swan', 'archived' => true])
        ->assertNotFound();

    expect($foreign->refresh()->name)->toBe('Shine')
        ->and($foreign->archived_at)->toBeNull();
});

test('the treasury covers the total only as far as every open account does', function (): void {
    $user = User::factory()->create();
    $shine = bankAccountFor($user);
    $swan = bankAccountFor($user);
    bankStatementOn($shine, fn (BankStatementFactory $factory): BankStatementFactory => $factory->withClosingBalance(1_482_000, '2026-08-12'));
    bankStatementOn($swan, fn (BankStatementFactory $factory): BankStatementFactory => $factory->withClosingBalance(300_000, '2026-08-05'));

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('balance.amount.amount', 1_782_000)
        ->assertJsonPath('coveredThrough', '2026-08-05');
});

test('an archived account stops holding back the treasury\'s coverage', function (): void {
    $user = User::factory()->create();
    $shine = bankAccountFor($user);
    $swan = bankAccountFor($user);
    bankStatementOn($shine, fn (BankStatementFactory $factory): BankStatementFactory => $factory->withClosingBalance(1_482_000, '2026-08-12'));
    bankStatementOn($swan, fn (BankStatementFactory $factory): BankStatementFactory => $factory->withClosingBalance(300_000, '2026-08-05'));

    $this->actingAs($user)
        ->putJson("/api/bank/accounts/{$swan->id}", ['name' => null, 'archived' => true])
        ->assertOk();

    $this->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('coveredThrough', '2026-08-12');
});

test('with every account archived, the treasury still covers through the earliest one', function (): void {
    $user = User::factory()->create();
    $shine = bankAccountFor($user, fn ($factory) => $factory->archived());
    $swan = bankAccountFor($user, fn ($factory) => $factory->archived());
    bankStatementOn($shine, fn (BankStatementFactory $factory): BankStatementFactory => $factory->withClosingBalance(1_482_000, '2026-08-12'));
    bankStatementOn($swan, fn (BankStatementFactory $factory): BankStatementFactory => $factory->withClosingBalance(300_000, '2026-08-05'));

    $this->actingAs($user)
        ->getJson('/api/treasury')
        ->assertOk()
        ->assertJsonPath('coveredThrough', '2026-08-05');
});

test('opens a bank account fed by files only', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/bank/accounts', ['name' => '  Vesterhus  '])
        ->assertCreated()
        ->assertJsonCount(1, 'accounts')
        ->assertJsonPath('accounts.0.name', 'Vesterhus')
        ->assertJsonPath('accounts.0.balance', null);
});

test('refuses a bank account without a name', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/bank/accounts', ['name' => ''])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('name');

    expect($user->bankAccounts()->exists())->toBeFalse();
});

test('opening a bank account is part of the beta', function (): void {
    bankAccountsReleasedAs('off');
    $user = User::factory()->create();

    $this->actingAs($user)
        ->postJson('/api/bank/accounts', ['name' => 'Vesterhus'])
        ->assertNotFound();

    expect($user->bankAccounts()->exists())->toBeFalse();
});

test('files a statement in the only open account when the others are closed', function (): void {
    $user = User::factory()->create();
    bankAccountFor($user, fn ($factory) => $factory->archived());
    $open = bankAccountFor($user);

    importBankCsv($user, null, '05/08/2026;VIR NORDLYS;100,00')->assertCreated();

    expect($user->bankStatements()->sole()->bank_account_id)->toBe($open->id);
});
