<?php

declare(strict_types=1);

namespace App\Domain\Shared\Database;

use Illuminate\Database\Connection;

final class ConstraintViolations
{
    public static function on(Connection $connection): DriverConstraintViolations
    {
        return match ($connection->getDriverName()) {
            'mysql', 'mariadb' => new MySqlConstraintViolations,
            'pgsql' => new PostgresConstraintViolations,
            'sqlite' => new SqliteConstraintViolations,
            default => new AnsiConstraintViolations,
        };
    }
}
