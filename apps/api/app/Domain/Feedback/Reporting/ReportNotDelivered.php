<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Reporting;

use RuntimeException;
use Throwable;

final class ReportNotDelivered extends RuntimeException
{
    private function __construct(string $message, public readonly bool $isRelayBusy, ?Throwable $previous = null)
    {
        parent::__construct($message, previous: $previous);
    }

    public static function relayBusy(): self
    {
        return new self('The relay is rate-limiting this instance.', isRelayBusy: true);
    }

    public static function because(string $reason, ?Throwable $previous = null): self
    {
        return new self($reason, isRelayBusy: false, previous: $previous);
    }
}
