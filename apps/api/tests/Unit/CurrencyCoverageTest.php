<?php

declare(strict_types=1);

use App\Domain\Settings\Models\UserSettings;
use App\Domain\Users\Models\User;
use Cknow\Money\Casts\MoneyIntegerCast;
use Illuminate\Database\Eloquent\Model;

/**
 * Every money column in the app as `table.column`, read off the casts rather
 * than enumerated by hand.
 *
 * @return list<string>
 */
function moneyCastColumns(): array
{
    $columns = [];
    // Unit tests do not boot the application, so app_path() is unavailable.
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
