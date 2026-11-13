<?php

declare(strict_types=1);

namespace App\Domain\Missions\Data;

use App\Domain\Missions\Models\Mission;
use Spatie\LaravelData\Data;

/**
 * A mission with the name of its client, and nothing else of the client: the
 * missions:read ability reaches this list and must not carry the client's
 * billing identity (SIRET, addresses, contact) along with it.
 */
class MissionListItemData extends Data
{
    public function __construct(
        public MissionData $mission,
        public string $clientName,
    ) {}

    public static function fromModel(Mission $mission): self
    {
        return new self(
            mission: MissionData::from($mission),
            clientName: $mission->client->name,
        );
    }
}
