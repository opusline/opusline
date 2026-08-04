<?php

declare(strict_types=1);

namespace App\Domain\Clients\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;

class ClientData extends Data
{
    public function __construct(
        public int $id,
        public string $slug,
        public string $name,
        public ?string $notes,
        public ?CarbonImmutable $archivedAt,
    ) {}
}
