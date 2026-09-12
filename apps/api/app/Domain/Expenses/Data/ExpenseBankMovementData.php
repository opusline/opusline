<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Bank\Models\BankMovement;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class ExpenseBankMovementData extends Data
{
    public function __construct(
        public int $id,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $bookedOn,
        public string $label,
    ) {}

    public static function fromModel(BankMovement $movement): self
    {
        return new self(id: $movement->id, bookedOn: $movement->booked_on, label: $movement->label);
    }
}
