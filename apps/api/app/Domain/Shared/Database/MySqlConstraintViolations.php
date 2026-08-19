<?php

declare(strict_types=1);

namespace App\Domain\Shared\Database;

use Illuminate\Database\QueryException;

final class MySqlConstraintViolations implements DriverConstraintViolations
{
    /** 1451 is a delete blocked by a child row, 1452 an insert with no parent row. */
    private const array FOREIGN_KEY_ERRNOS = [1451, 1452];

    public function isForeignKeyViolation(QueryException $exception): bool
    {
        return in_array($this->errno($exception), self::FOREIGN_KEY_ERRNOS, true);
    }

    private function errno(QueryException $exception): ?int
    {
        $errorInfo = $exception->errorInfo;

        return isset($errorInfo[1]) && is_numeric($errorInfo[1]) ? (int) $errorInfo[1] : null;
    }
}
