<?php

declare(strict_types=1);

namespace App\Domain\Shared\Database;

use Illuminate\Database\QueryException;

final class SqliteConstraintViolations implements DriverConstraintViolations
{
    private const string FOREIGN_KEY_MESSAGE = 'FOREIGN KEY constraint failed';

    public function isForeignKeyViolation(QueryException $exception): bool
    {
        return str_contains($exception->getMessage(), self::FOREIGN_KEY_MESSAGE);
    }
}
