<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/** One URSSAF period of the year, for the « contrôle de cohérence » table. */
class IncomeTaxReturnPeriodData extends Data
{
    public function __construct(
        public string $period,
        public MoneyData $base,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $declaredOn,
    ) {}
}
