<?php

declare(strict_types=1);

namespace App\Domain\Clients\Data;

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Missions\Data\MissionData;
use App\Domain\Shared\Enums\Color;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class ClientWithMissionsData extends Data
{
    /**
     * @param  list<MissionData>  $missions
     */
    public function __construct(
        public int $id,
        public string $slug,
        public string $name,
        public ClientType $type,
        public ?string $notes,
        public ?string $siret,
        public ?string $vatNumber,
        public ?string $billingAddress,
        public ?string $billingContactName,
        public ?string $billingEmail,
        public Color $color,
        public int $paymentTermsDays,
        public ?CarbonImmutable $archivedAt,
        public CarbonImmutable $createdAt,
        #[DataCollectionOf(MissionData::class)]
        public array $missions,
    ) {}
}
