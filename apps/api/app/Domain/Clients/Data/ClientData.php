<?php

declare(strict_types=1);

namespace App\Domain\Clients\Data;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Data\MissionData;
use App\Domain\Missions\Models\Mission;
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

    public static function fromModel(Client $client): self
    {
        return new self(
            id: $client->id,
            slug: $client->slug,
            name: $client->name,
            notes: $client->notes,
            archivedAt: $client->archived_at,
            missions: array_values(
                $client->missions
                    ->map(fn (Mission $mission): MissionData => MissionData::fromModel($mission))
                    ->all(),
            ),
        );
    }
}
