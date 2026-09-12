<?php

declare(strict_types=1);

namespace App\Domain\Declarations\Data;

use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * The CFE sheet for one year. The commune sets the bill, so the figure is
 * only guessed for the running year: an older year's bill is whatever was
 * paid.
 */
class CfeReturnData extends Data
{
    public function __construct(
        public int $year,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $dueOn,
        /** What the account entered from its avis (isEstimate false), else last year's payment or the barème. */
        public ?MoneyData $expected,
        public bool $isEstimate,
        /** A twelfth of the expected bill per elapsed month, gross of any June acompte; null once the payment is recorded. */
        public ?MoneyData $provisioned,
        public ?SignedMoneyData $gap,
        public int $monthsProvisioned,
        public ?DeclarationCompletionData $completion,
    ) {}
}
