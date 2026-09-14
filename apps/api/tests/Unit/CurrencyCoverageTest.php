<?php

declare(strict_types=1);

use App\Domain\Bank\Models\BankMovement;
use App\Domain\Bank\Models\BankStatement;
use App\Domain\Bank\Models\PersonalTransfer;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Models\Subscription;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Models\Mission;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Users\Models\User;
use Cknow\Money\Casts\MoneyIntegerCast;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

/**
 * Every money column in the app as `table.column`, read off the casts rather
 * than enumerated by hand.
 *
 * @return list<string>
 */
function moneyCastColumns(): array
{
    $columns = [];
    $domainPath = dirname(__DIR__, 2).'/app/Domain';

    foreach (glob($domainPath.'/*/Models/*.php') ?: [] as $path) {
        $class = 'App\\Domain'.str_replace('/', '\\', substr($path, strlen($domainPath), -4));

        if (! is_subclass_of($class, Model::class)) {
            continue;
        }

        $model = new $class;

        foreach ($model->getCasts() as $column => $cast) {
            if (str_starts_with((string) $cast, MoneyIntegerCast::class)) {
                $columns[] = $model->getTable().'.'.$column;
            }
        }
    }

    sort($columns);

    return $columns;
}

/**
 * One stored row per currency-locking table, so the predicate is checked
 * against money that really exists rather than against a list of column names.
 *
 * @return array<string, array{Closure(User): void}>
 */
function currencyLockingArrangements(): array
{
    return [
        'missions' => [fn (User $user): Mission => missionOwnedBy($user)],
        'invoices' => [fn (User $user): Invoice => invoiceOwnedBy($user)],
        'bank_statements' => [fn (User $user): BankStatement => bankStatementOwnedBy($user)],
        'bank_movements' => [fn (User $user): BankMovement => bankMovementFor($user)],
        'personal_transfers' => [fn (User $user): PersonalTransfer => personalTransferFor($user)],
        'expenses' => [fn (User $user): Expense => expenseOwnedBy($user)],
        'subscription_amounts' => [fn (User $user): Subscription => subscriptionOwnedBy($user)],
    ];
}

test('every money column either locks the account currency or is cleared with it', function (): void {
    $declared = [];

    foreach (User::CURRENCY_LOCKING_COLUMNS as $table => $columns) {
        foreach ($columns as $column) {
            $declared[] = $table.'.'.$column;
        }
    }

    foreach (UserSettings::CURRENCY_SCOPED_COLUMNS as $column) {
        $declared[] = 'user_settings.'.$column;
    }

    sort($declared);

    expect(moneyCastColumns())->toBe(
        $declared,
        'A money column exists that no currency rule covers. Decide whether it is a '
        .'record (add it to User::CURRENCY_LOCKING_COLUMNS and to hasLockedCurrency()) '
        .'or a re-enterable figure (add it to UserSettings::CURRENCY_SCOPED_COLUMNS, '
        .'which ChangeAccountCurrency nulls).',
    );
});

test('every currency-locking table has a row that witnesses it', function (): void {
    expect(array_keys(currencyLockingArrangements()))->toBe(
        array_keys(User::CURRENCY_LOCKING_COLUMNS),
        'A currency-locking table has no arrangement here, so nothing proves '
        .'hasLockedCurrency() can see a row in it. Add one.',
    );
});

test('a stored amount locks the account currency', function (Closure $arrange): void {
    $user = User::factory()->create();

    expect($user->hasLockedCurrency())->toBeFalse();

    $arrange($user);

    expect($user->hasLockedCurrency())->toBeTrue();
})->with(currencyLockingArrangements());

test('an expense that exists only as a tombstone still locks the account currency', function (): void {
    $user = User::factory()->create();

    // DeleteExpense soft-deletes a subscription debit so it cannot
    // re-materialise; the row it leaves behind still holds cents.
    expenseOwnedBy($user)->delete();

    expect($user->expenses()->exists())->toBeFalse()
        ->and($user->hasLockedCurrency())->toBeTrue();
});
