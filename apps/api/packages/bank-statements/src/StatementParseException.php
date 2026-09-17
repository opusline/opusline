<?php

declare(strict_types=1);

namespace Opusline\BankStatements;

use RuntimeException;
use Throwable;

/** A statement file the user handed over could not be understood. */
class StatementParseException extends RuntimeException
{
    public function __construct(public readonly StatementParseFailure $reason, ?Throwable $previous = null)
    {
        parent::__construct($reason->name, 0, $previous);
    }
}
