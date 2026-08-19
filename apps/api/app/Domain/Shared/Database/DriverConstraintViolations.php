<?php

declare(strict_types=1);

namespace App\Domain\Shared\Database;

use Illuminate\Database\QueryException;
use Illuminate\Database\UniqueConstraintViolationException;

/**
 * What one database engine's failures mean, in the application's terms.
 *
 * Engines do not agree on how they report a constraint failure: PostgreSQL gives
 * every kind its own SQLSTATE, MySQL folds them all into 23000 and distinguishes
 * by driver errno, SQLite only says so in the message text. Callers ask the
 * question they care about and let the implementation own its dialect.
 *
 * Unique violations are deliberately absent: Laravel already detects those per
 * driver and raises {@see UniqueConstraintViolationException}, so catch that
 * instead of adding a method here.
 */
interface DriverConstraintViolations
{
    /**
     * Whether the statement failed because a row in another table still points at
     * the row being written or deleted.
     */
    public function isForeignKeyViolation(QueryException $exception): bool;
}
