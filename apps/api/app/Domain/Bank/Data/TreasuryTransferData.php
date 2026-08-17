<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * One transfer the freelancer made from their bank to their personal account
 * and noted here. Opusline never moves the money; this is the record of it.
 */
class TreasuryTransferData extends Data
{
    public function __construct(
        public int $id,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $transferredOn,
        public MoneyData $amount,
        public ?string $note,
        /**
         * Whether the account balance already reflects this transfer, because a
         * statement covering its date has since been imported. An unsettled
         * transfer is still deducted from what is safe to move.
         */
        public bool $isSettled,
    ) {}
}
