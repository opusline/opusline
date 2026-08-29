<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One page of the movement table past the window BankAccountData carries.
 */
class BankMovementPageData extends Data
{
    /**
     * @param  list<BankMovementData>  $movements
     */
    public function __construct(
        /** Most recent movement of the page first. */
        #[DataCollectionOf(BankMovementData::class)]
        public array $movements,
        /** Cursor for the next (older) page; null on the last one. */
        public ?string $nextCursor,
    ) {}
}
