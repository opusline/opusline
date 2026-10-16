<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Money\Rate;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

class CatalogItemInputData extends Data
{
    public function __construct(
        #[Max(255)]
        public string $label,
        #[Enum(LineUnit::class)]
        public LineUnit $unit,
        /** Before tax: the HT price a line is quoted at. */
        public MoneyData $unitPrice,
        #[IntegerType, Between(0, Rate::BASIS_POINTS)]
        public int $vatRateBp,
        #[Max(1000)]
        public ?string $detail = null,
    ) {}
}
