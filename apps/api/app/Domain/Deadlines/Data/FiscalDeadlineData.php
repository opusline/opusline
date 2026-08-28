<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Data;

use App\Domain\Deadlines\Calendar\DeadlineAmount;
use App\Domain\Deadlines\Calendar\FiscalDeadline;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class FiscalDeadlineData extends Data
{
    public function __construct(
        public FiscalDeadlineKind $kind,
        /** `2026-07`, `2026-Q3` or `2026` — what a completion is written against. */
        public string $periodKey,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $periodStart,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $periodEnd,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $dueOn,
        /** Null when nothing can be said yet; see DeadlineAmount. */
        public ?MoneyData $amount,
        public ?int $rateBp,
        /**
         * What the rate was applied to — the HT collected over the period — so the
         * screen can name both numbers of « X € encaissés × Y % » without dividing
         * the rate back out of an amount that was rounded on the way in.
         */
        public ?MoneyData $base,
        /** Whether the amount was derived from collections rather than entered by the user. */
        public bool $isEstimate,
        /** The day the user ticked it off, null while it is still owed. */
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $completedOn,
    ) {}

    public static function fromOccurrence(
        FiscalDeadline $deadline,
        DeadlineAmount $price,
        ?CarbonImmutable $completedOn,
    ): self {
        return new self(
            kind: $deadline->kind,
            periodKey: $deadline->periodKey,
            periodStart: $deadline->periodStart,
            periodEnd: $deadline->periodEnd,
            dueOn: $deadline->dueOn,
            amount: $price->amount instanceof Money ? MoneyData::fromMoney($price->amount) : null,
            rateBp: $price->rateBp,
            base: $price->base instanceof Money ? MoneyData::fromMoney($price->base) : null,
            isEstimate: $price->isEstimate,
            completedOn: $completedOn,
        );
    }
}
