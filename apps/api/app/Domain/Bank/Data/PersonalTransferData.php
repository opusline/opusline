<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Bank\Models\PersonalTransfer;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class PersonalTransferData extends Data
{
    public function __construct(
        public int $id,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $transferredOn,
        public MoneyData $amount,
        public ?string $note,
        /**
         * Whether the shown balance already counts this transfer. False means
         * it is still deducted on top of the balance, until a statement
         * covering its date is imported.
         */
        public bool $reflectedInBalance,
    ) {}

    public static function fromModel(PersonalTransfer $transfer, bool $reflectedInBalance): self
    {
        return new self(
            id: $transfer->id,
            transferredOn: $transfer->transferred_on,
            amount: MoneyData::fromMoney($transfer->amount_cents),
            note: $transfer->note,
            reflectedInBalance: $reflectedInBalance,
        );
    }
}
