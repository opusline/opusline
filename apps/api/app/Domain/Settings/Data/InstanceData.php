<?php

declare(strict_types=1);

namespace App\Domain\Settings\Data;

use Spatie\LaravelData\Data;

class InstanceData extends Data
{
    public function __construct(
        public string $version,
        public string $database,
        public ?BackupRecordData $backup,
    ) {}
}
