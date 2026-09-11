<?php

declare(strict_types=1);

namespace App\Domain\Settings\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;

/**
 * What opusline-backup.sh left behind the last time it ran.
 *
 * A record, not a measurement: the archive lives on the host, outside anything
 * this container can reach, so the app can say when a backup was taken and where
 * it was written — never that the file is still there.
 */
class BackupRecordData extends Data
{
    public function __construct(
        public CarbonImmutable $takenAt,
        public string $archive,
        public int $bytes,
    ) {}
}
