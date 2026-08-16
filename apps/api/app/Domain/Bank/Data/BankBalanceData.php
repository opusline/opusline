<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Bank\Enums\BankBalanceSource;
use App\Domain\Shared\Data\SignedMoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * The current balance shown on the Solde tile: the newest anchor (typed by
 * hand or read off a statement) rolled forward through the movements booked
 * after it. `asOf` cites the anchor, not the roll-forward — and is null for
 * a derived balance, which has no anchor date to cite.
 */
class BankBalanceData extends Data
{
    public function __construct(
        public SignedMoneyData $amount,
        public BankBalanceSource $source,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $asOf,
    ) {}
}
