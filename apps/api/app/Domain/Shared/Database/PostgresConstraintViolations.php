<?php

declare(strict_types=1);

namespace App\Domain\Shared\Database;

use Illuminate\Database\QueryException;

final class PostgresConstraintViolations implements DriverConstraintViolations
{
    private const string FOREIGN_KEY_VIOLATION = '23503';

    public function isForeignKeyViolation(QueryException $exception): bool
    {
        return (string) $exception->getCode() === self::FOREIGN_KEY_VIOLATION;
    }
}
