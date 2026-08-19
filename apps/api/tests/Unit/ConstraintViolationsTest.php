<?php

declare(strict_types=1);

use App\Domain\Shared\Database\AnsiConstraintViolations;
use App\Domain\Shared\Database\ConstraintViolations;
use App\Domain\Shared\Database\DriverConstraintViolations;
use App\Domain\Shared\Database\MySqlConstraintViolations;
use App\Domain\Shared\Database\PostgresConstraintViolations;
use App\Domain\Shared\Database\SqliteConstraintViolations;
use Illuminate\Database\QueryException;

/**
 * A failure as the driver would hand it over.
 *
 * PDO reports SQLSTATE as a string; the int constructor is the only way to seed the
 * code from outside and casts back to the same digits, which is all the mappers read.
 */
function driverFailure(string $sqlState, ?int $driverErrno = null, string $message = ''): QueryException
{
    $pdoException = new PDOException($message, (int) $sqlState);
    $pdoException->errorInfo = [$sqlState, $driverErrno, $message];

    return new QueryException('testing', 'delete from "clients" where "id" = ?', [1], $pdoException);
}

test('PostgreSQL reads the foreign key violation off its own SQLSTATE', function (string $sqlState, bool $isForeignKey): void {
    expect((new PostgresConstraintViolations)->isForeignKeyViolation(driverFailure($sqlState)))->toBe($isForeignKey);
})->with([
    'foreign key' => ['23503', true],
    'unique' => ['23505', false],
    'not null' => ['23502', false],
    'the generic class code it never emits' => ['23000', false],
]);

test('MySQL tells the kinds apart by errno, because every one of them is SQLSTATE 23000', function (?int $errno, bool $isForeignKey): void {
    expect((new MySqlConstraintViolations)->isForeignKeyViolation(driverFailure('23000', $errno)))->toBe($isForeignKey);
})->with([
    'delete blocked by a child row' => [1451, true],
    'insert with no parent row' => [1452, true],
    'duplicate key' => [1062, false],
    'no errno at all' => [null, false],
]);

test('SQLite has only the message to go on', function (string $message, bool $isForeignKey): void {
    expect((new SqliteConstraintViolations)->isForeignKeyViolation(driverFailure('23000', 19, $message)))->toBe($isForeignKey);
})->with([
    'foreign key' => ['FOREIGN KEY constraint failed', true],
    'unique' => ['UNIQUE constraint failed: running_timers.user_id', false],
    'not null' => ['NOT NULL constraint failed: clients.name', false],
]);

test('an untested engine falls back to the standard integrity constraint class', function (string $sqlState, bool $isForeignKey): void {
    expect((new AnsiConstraintViolations)->isForeignKeyViolation(driverFailure($sqlState)))->toBe($isForeignKey);
})->with([
    'the class itself' => ['23000', true],
    'a specific member of the class' => ['23503', true],
    'a syntax error' => ['42000', false],
    'a deadlock' => ['40001', false],
]);

test('the driver in use decides which mapping answers', function (string $driver, string $expected): void {
    expect(ConstraintViolations::forDriver($driver))
        ->toBeInstanceOf($expected)
        ->toBeInstanceOf(DriverConstraintViolations::class);
})->with([
    'mysql' => ['mysql', MySqlConstraintViolations::class],
    'mariadb' => ['mariadb', MySqlConstraintViolations::class],
    'pgsql' => ['pgsql', PostgresConstraintViolations::class],
    'sqlite' => ['sqlite', SqliteConstraintViolations::class],
    'anything else' => ['sqlsrv', AnsiConstraintViolations::class],
]);
