<?php

declare(strict_types=1);

namespace App\Domain\Shared\Database;

use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

final class ConstraintViolations
{
    /**
     * A failed statement names the connection it came from, so a catch block needs
     * nothing but the exception it already has.
     */
    public static function isForeignKeyViolation(QueryException $exception): bool
    {
        return self::forDriver(
            DB::connection($exception->getConnectionName())->getDriverName(),
        )->isForeignKeyViolation($exception);
    }

    public static function forDriver(string $driver): DriverConstraintViolations
    {
        return match ($driver) {
            'mysql', 'mariadb' => new MySqlConstraintViolations,
            'pgsql' => new PostgresConstraintViolations,
            'sqlite' => new SqliteConstraintViolations,
            default => new AnsiConstraintViolations,
        };
    }
}
