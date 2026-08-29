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
        /** The most recent movements only — older pages come from GET /bank/movements. */
        #[DataCollectionOf(BankMovementData::class)]
        public array $movements,
        /** Cursor for the page after `movements`; null when nothing older exists. */
        public ?string $nextMovementsCursor,
        /** A credit with no invoice and no pending suggestion, anywhere in the history. */
        public bool $hasUnlinkedCredits,
        /** Newest import first. */
        #[DataCollectionOf(BankStatementData::class)]
        public array $statements,
    ) {}
}
