<?php

declare(strict_types=1);

namespace App\Domain\Bank\EnableBanking;

use App\Domain\Bank\Enums\BankSyncError;
use RuntimeException;
use Throwable;

/**
 * A call to the bank through Enable Banking that did not deliver. The message
 * is for logs only — the user reads the reason's translation — and never
 * carries a response body, which could hold the account's transactions.
 */
class BankSyncFailed extends RuntimeException
{
    public function __construct(
        public readonly BankSyncError $reason,
        string $message,
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, previous: $previous);
    }
}
