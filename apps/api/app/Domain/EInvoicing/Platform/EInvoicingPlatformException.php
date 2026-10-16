<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Platform;

use App\Domain\EInvoicing\Enums\EInvoicingError;
use App\Domain\Shared\Sync\SyncRefused;
use RuntimeException;
use Throwable;

/**
 * A call to the plateforme agréée that did not deliver. The message is for
 * logs only; the user reads the reason's translation, and the message never
 * carries a response body, which could hold a supplier's invoice.
 */
class EInvoicingPlatformException extends RuntimeException implements SyncRefused
{
    public function __construct(
        public readonly EInvoicingError $reason,
        string $message,
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, previous: $previous);
    }

    public function reasonName(): string
    {
        return $this->reason->name;
    }
}
