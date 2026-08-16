<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Bank\Enums\BankMatchReason;
use App\Domain\Bank\Models\BankMatch;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * A pending reconciliation suggestion: the bank movement on the left, the
 * invoice it appears to settle on the right.
 */
class BankMatchData extends Data
{
    public function __construct(
        public int $id,
        public BankMatchReason $reason,
        public int $movementId,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $bookedOn,
        public string $label,
        public MoneyData $amount,
        public BankMatchInvoiceData $invoice,
    ) {}

    public static function fromModel(BankMatch $match): self
    {
        return new self(
            id: $match->id,
            reason: $match->reason,
            movementId: $match->bank_movement_id,
            bookedOn: $match->movement->booked_on,
            label: $match->movement->label,
            amount: MoneyData::fromMoney($match->movement->amount_cents),
            invoice: BankMatchInvoiceData::fromModel($match->invoice),
        );
    }
}
