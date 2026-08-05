<?php

declare(strict_types=1);

namespace App\Domain\Missions\Data;

use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Enums\Color;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class MissionData extends Data
{
    public function __construct(
        public int $id,
        public string $slug,
        public int $clientId,
        public string $name,
        public ?string $endClientName,
        public BillingMode $billingMode,
        #[MapInputName('rate_cents')]
        public ?MoneyData $rate,
        public ?EntryRounding $rounding,
        public MissionStatus $status,
        public bool $craRequired,
        public ?Color $color,
        public ?string $notes,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $startDate,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $endDate,
    ) {}
}
