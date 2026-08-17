<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * Everything the « Combien je peux me virer ? » screen shows.
 */
class TreasuryData extends Data
{
    /**
     * @param  list<TreasuryTransferData>  $transfers
     */
    public function __construct(
        /** Null until a balance is typed or a statement imported. */
        public ?BankBalanceData $balance,
        public BankProvisionsData $provisions,
        /**
         * Balance less the provisions and less transfers the balance does not
         * know about yet. Floored at zero: a negative figure is not an amount
         * you may move, it is a warning, and `isShort` carries that instead.
         */
        public MoneyData $transferable,
        /** How far past safety the account already is, when it is. */
        public ?SignedMoneyData $shortfall,
        /** Transfers noted but not yet covered by an imported statement. */
        public MoneyData $pendingTransfers,
        /** Newest first. */
        #[DataCollectionOf(TreasuryTransferData::class)]
        public array $transfers,
    ) {}
}
