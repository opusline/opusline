<?php

declare(strict_types=1);

use App\Domain\Bank\Enums\BankStatementFormat;
use App\Domain\Users\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Testing\TestResponse;

beforeEach(fn () => freezeTodayAtUtcNoon());

function importStatement(User $user, string $fixture, string $asName, array $extra = []): TestResponse
{
    return test()->actingAs($user)->post(
        '/api/bank/statements',
        ['file' => UploadedFile::fake()->createWithContent($asName, bankFixture($fixture)), ...$extra],
        ['Accept' => 'application/json'],
    );
}

test('imports a csv statement end to end', function (): void {
    $user = User::factory()->create();

    importStatement($user, 'semicolon_solde.csv', 'releve-aout.csv')
        ->assertCreated()
        ->assertJsonPath('lineCount', 4)
        ->assertJsonPath('importedCount', 4)
        ->assertJsonPath('suggestionCount', 0)
        ->assertJsonPath('account.statements.0.fileName', 'releve-aout.csv')
        ->assertJsonPath('account.statements.0.periodStart', '2026-07-15')
        ->assertJsonPath('account.statements.0.periodEnd', '2026-07-31')
        ->assertJsonPath('account.statements.0.lineCount', 4)
        ->assertJsonPath('account.movements.0.bookedOn', '2026-07-31')
        ->assertJsonPath('account.movements.0.amount.amount', 61_200)
        // The fixture's Solde column anchors the balance without typing one.
        ->assertJsonPath('account.balance.amount.amount', 1_482_000)
        ->assertJsonPath('account.balance.source', 1)
        ->assertJsonPath('account.balance.asOf', '2026-07-31');

    expect($user->bankStatements()->sole()->format)->toBe(BankStatementFormat::Csv)
        ->and($user->bankMovements()->count())->toBe(4);
});

test('re-importing an overlapping statement adds nothing', function (): void {
    $user = User::factory()->create();

    importStatement($user, 'semicolon_solde.csv', 'releve.csv')->assertCreated();

    importStatement($user, 'semicolon_solde.csv', 'releve-bis.csv')
        ->assertCreated()
        ->assertJsonPath('lineCount', 4)
        ->assertJsonPath('importedCount', 0)
        ->assertJsonPath('suggestionCount', 0);

    expect($user->bankMovements()->count())->toBe(4)
        ->and($user->bankStatements()->count())->toBe(2);
});

test('two identical same-day payments stay two movements', function (): void {
    $user = User::factory()->create();
    $csv = "Date;Libellé;Montant\n05/08/2026;VIR NORDLYS;100,00\n05/08/2026;VIR NORDLYS;100,00\n";

    test()->actingAs($user)->post(
        '/api/bank/statements',
        ['file' => UploadedFile::fake()->createWithContent('double.csv', $csv)],
        ['Accept' => 'application/json'],
    )->assertCreated()->assertJsonPath('importedCount', 2);

    expect($user->bankMovements()->count())->toBe(2);
});

test('deduplicates ofx re-imports on the bank\'s own reference', function (): void {
    $user = User::factory()->create();

    importStatement($user, 'statement_v102.ofx', 'export.ofx')
        ->assertCreated()
        ->assertJsonPath('importedCount', 2);

    importStatement($user, 'statement_v102.ofx', 'export-2.ofx')
        ->assertCreated()
        ->assertJsonPath('importedCount', 0);
});

test('anchors the balance on the file\'s ledger balance when none is typed', function (): void {
    $user = User::factory()->create();

    importStatement($user, 'statement_v102.ofx', 'export.ofx')
        ->assertCreated()
        ->assertJsonPath('account.balance.amount.amount', 1_482_000)
        ->assertJsonPath('account.balance.asOf', '2026-08-10')
        ->assertJsonPath('account.balance.source', 1);
});

test('lets the typed balance beat the file\'s ledger balance', function (): void {
    $user = User::factory()->create();

    importStatement($user, 'statement_v102.ofx', 'export.ofx', [
        'balanceAmount' => '999999',
        'balanceCurrency' => 'EUR',
    ])
        ->assertCreated()
        ->assertJsonPath('account.balance.amount.amount', 999_999);

    expect($user->bankStatements()->sole()->closing_balance_cents?->getAmount())->toBe('999999');
});

test('refuses a typed balance in another currency', function (): void {
    $user = User::factory()->create();

    importStatement($user, 'statement_v102.ofx', 'export.ofx', [
        'balanceAmount' => '999999',
        'balanceCurrency' => 'USD',
    ])
        ->assertStatus(422)
        ->assertJsonValidationErrors('balanceCurrency');

    expect($user->bankStatements()->count())->toBe(0);
});

test('refuses a statement in another currency and writes nothing', function (): void {
    $user = User::factory()->create();
    $user->settings()->sole()->update(['currency' => 'USD']);

    importStatement($user, 'camt053.xml', 'releve.xml')
        ->assertStatus(422)
        ->assertJsonValidationErrors('file');

    expect($user->bankStatements()->count())->toBe(0)
        ->and($user->bankMovements()->count())->toBe(0);
});

test('refuses unreadable files and writes nothing', function (string $fixture, string $asName): void {
    $user = User::factory()->create();

    importStatement($user, $fixture, $asName)
        ->assertStatus(422)
        ->assertJsonValidationErrors('file');

    expect($user->bankStatements()->count())->toBe(0)
        ->and($user->bankMovements()->count())->toBe(0);
})->with([
    'binary garbage' => ['garbage.bin', 'releve.csv'],
    'empty file' => ['empty.txt', 'releve.txt'],
    'csv without a header' => ['headerless.csv', 'releve.csv'],
]);

test('refuses extensions no bank export uses', function (): void {
    $user = User::factory()->create();

    test()->actingAs($user)->post(
        '/api/bank/statements',
        ['file' => UploadedFile::fake()->createWithContent('releve.pdf', '%PDF-1.4')],
        ['Accept' => 'application/json'],
    )->assertStatus(422)->assertJsonValidationErrors('file');
});

test('requires authentication', function (): void {
    $this->postJson('/api/bank/statements')->assertUnauthorized();
});
