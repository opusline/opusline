<?php

declare(strict_types=1);

namespace App\Domain\Feedback\Reporting;

/**
 * The id the relay rate-limits and blocklists this instance by. Derived from
 * APP_KEY, so it is stable, needs no storage and reveals nothing of the key;
 * rotating the key gives the instance a new id.
 */
final class InstanceId
{
    public static function current(): string
    {
        $hash = hash_hmac('sha256', 'opusline-instance-id', config()->string('app.key'));

        return implode('-', [
            substr($hash, 0, 8),
            substr($hash, 8, 4),
            substr($hash, 12, 4),
            substr($hash, 16, 4),
            substr($hash, 20, 12),
        ]);
    }
}
