<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * A debit that comes back every month on the compte pro with nothing in the
 * journal to explain it — the banner's « Prélèvement récurrent détecté ».
 */
class RecurringDebitData extends Data
{
    /**
     * @param  list<string>  $months  the `Y-m` it was seen in, oldest first
     */
    public function __construct(
        /** The label as the bank last wrote it. */
        public string $label,
        public MoneyData $amount,
        /** The day of the month it usually lands on — the median of the ones seen. */
        public int $debitDay,
        public array $months,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $lastBookedOn,
    ) {}
}
