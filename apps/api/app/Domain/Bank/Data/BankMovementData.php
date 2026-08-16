<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Bank\Models\BankMovement;
use App\Domain\Shared\Data\SignedMoneyData;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class BankMovementData extends Data
{
    public function __construct(
        public int $id,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $bookedOn,
        public string $label,
        public SignedMoneyData $amount,
        /** Null when no balance anchor exists yet — the column renders a dash. */
        public ?SignedMoneyData $runningBalance,
        /** The invoice a validated reconciliation linked, when there is one. */
        public ?BankMovementInvoiceData $invoice,
        /** The still-pending suggestion on this movement, when there is one. */
        public ?int $pendingMatchId,
    ) {}

    public static function fromModel(BankMovement $movement, ?Money $runningBalance): self
    {
        $match = $movement->match;

        return new self(
            id: $movement->id,
            bookedOn: $movement->booked_on,
            label: $movement->label,
            amount: SignedMoneyData::fromMoney($movement->amount_cents),
            runningBalance: $runningBalance instanceof Money ? SignedMoneyData::fromMoney($runningBalance) : null,
            invoice: $movement->invoice === null ? null : BankMovementInvoiceData::fromModel($movement->invoice),
            pendingMatchId: $match !== null && $match->status === BankMatchStatus::Pending ? $match->id : null,
        );
    }
}
