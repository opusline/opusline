<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Platform;

use App\Domain\EInvoicing\Enums\LifecycleStatus;

/** An invoice the platform accepted, under the id it will carry there from now on. */
final readonly class SubmittedInvoice
{
    public function __construct(
        public string $platformId,
        public LifecycleStatus $status,
    ) {}
}
