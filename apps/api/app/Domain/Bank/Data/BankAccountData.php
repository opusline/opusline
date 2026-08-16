<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * Everything on the Compte pro screen.
 */
class BankAccountData extends Data
{
    /**
     * @param  list<BankMatchData>  $pendingMatches
     * @param  list<BankMovementData>  $movements
     * @param  list<BankStatementData>  $statements
     */
    public function __construct(
        /** Null until a balance is typed or a statement imported. */
        public ?BankBalanceData $balance,
        public BankProvisionsData $provisions,
        /** Most recent movement first. */
        #[DataCollectionOf(BankMatchData::class)]
        public array $pendingMatches,
        #[DataCollectionOf(BankMovementData::class)]
        public array $movements,
        /** Newest import first. */
        #[DataCollectionOf(BankStatementData::class)]
        public array $statements,
    ) {}
}
