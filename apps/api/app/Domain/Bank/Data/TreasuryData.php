<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * What the Virement screen answers: of the money on the pro account, how much
 * is actually the user's. Every figure is null on an account with no balance at
 * all — a zero there would read as a fact, and it is not one.
 */
class TreasuryData extends Data
{
    public function __construct(
        public ?BankBalanceData $balance,
        /** Recorded transfers no imported statement covers yet; zero when none. */
        public MoneyData $pendingTransfers,
        /** The date the balance provably accounts for debits through. */
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $coveredThrough,
        public BankProvisionsData $provisions,
        /** Signed: the provisions legitimately outgrow a thin account. */
        public ?SignedMoneyData $transferable,
        /** @var list<PersonalTransferData> */
        #[DataCollectionOf(PersonalTransferData::class)]
        public array $transfers,
    ) {}
}
