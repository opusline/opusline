<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Receipts;

use App\Domain\Expenses\Enums\ClaudeReadingFailure;
use RuntimeException;
use Throwable;

final class ClaudeReadingFailed extends RuntimeException
{
    public function __construct(public readonly ClaudeReadingFailure $reason, string $message, ?Throwable $previous = null)
    {
        parent::__construct($message, previous: $previous);
    }
}
