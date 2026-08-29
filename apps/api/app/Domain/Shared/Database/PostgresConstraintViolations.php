<?php

declare(strict_types=1);

namespace App\Domain\Shared\Database;

use Illuminate\Database\QueryException;

final class PostgresConstraintViolations implements DriverConstraintViolations
{
    /**
     * Both spellings of "a foreign key stopped you": 23503 is the classic
     * foreign_key_violation, 23001 the restrict_violation Postgres 18 raises
     * for ON DELETE RESTRICT constraints.
     *
     * @var list<string>
     */
    private const array FOREIGN_KEY_VIOLATIONS = ['23503', '23001'];

    public function isForeignKeyViolation(QueryException $exception): bool
    {
        return in_array((string) $exception->getCode(), self::FOREIGN_KEY_VIOLATIONS, true);
    }
}
