<?php

declare(strict_types=1);

namespace App\Domain\Shared\Database;

use Illuminate\Database\QueryException;

final class AnsiConstraintViolations implements DriverConstraintViolations
{
    private const string INTEGRITY_CONSTRAINT_VIOLATION_CLASS = '23';

    public function isForeignKeyViolation(QueryException $exception): bool
    {
        return str_starts_with((string) $exception->getCode(), self::INTEGRITY_CONSTRAINT_VIOLATION_CLASS);
    }
}
