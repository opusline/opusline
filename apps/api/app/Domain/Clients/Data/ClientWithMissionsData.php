<?php

declare(strict_types=1);

namespace App\Domain\Clients\Data;

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Clients\Enums\VatTreatment;
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
        public VatTreatment $vatTreatment,
        public ?string $billingAddressLine1,
        public ?string $billingAddressLine2,
        public ?string $billingPostalCode,
        public ?string $billingCity,
        public ?string $billingCountry,
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
