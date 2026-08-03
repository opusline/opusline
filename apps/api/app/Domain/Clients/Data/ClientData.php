<?php

declare(strict_types=1);

namespace App\Domain\Clients\Data;

use App\Domain\Missions\Data\MissionData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class ClientData extends Data
{
    /**
     * @param  list<MissionData>  $missions
     */
    public function __construct(
        public int $id,
        public string $slug,
        public string $name,
        public ?string $notes,
        public ?CarbonImmutable $archivedAt,
        #[DataCollectionOf(MissionData::class)]
        public array $missions,
    ) {}
}
