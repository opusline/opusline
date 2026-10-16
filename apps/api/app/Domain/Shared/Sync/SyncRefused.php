<?php

declare(strict_types=1);

namespace App\Domain\Shared\Sync;

use UnitEnum;

/**
 * A third party refused an unattended sync: an ordinary night, logged by its
 * reason rather than reported as a crash.
 */
interface SyncRefused
{
    public UnitEnum $reason { get; }
}
