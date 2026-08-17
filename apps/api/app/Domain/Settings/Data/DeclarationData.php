<?php

declare(strict_types=1);

namespace App\Domain\Settings\Data;

use App\Domain\Settings\Enums\FiscalDeadlineKind;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * One period you owe a return for, and whether you have filed it.
 *
 * The period, amount and due date are the same figures the Échéances screen
 * shows — both read ListFiscalDeadlines, so the two pages can never disagree
 * about what July owes.
 */
class DeclarationData extends Data
{
    public function __construct(
        public FiscalDeadlineKind $kind,
        public string $period,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $dueOn,
        /** What Opusline computes the period owes; null while it is running. */
        public ?MoneyData $amount,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $filedOn,
        /**
         * What was actually declared, when it differs from the computed figure
         * or was recorded alongside the filing. Null when only ticked off.
         */
        public ?MoneyData $declaredAmount,
        public bool $isFiled,
        /** Not filed and the date has passed. */
        public bool $isLate,
    ) {}
}
