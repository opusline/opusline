<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * An instalment of a fixed price that is asking to be billed: which step, on
 * which mission, and what creating the invoice would mark as billed.
 */
class InvoiceTodoStepData extends Data
{
    public function __construct(
        public int $billingStepId,
        public string $label,
        public int $missionId,
        public string $missionName,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $dueOn,
        /** True when the step surfaced because someone said the work was done. */
        public bool $isReady,
        /** Days past its expected date; zero when it has none or has not passed. */
        public int $daysLate,
        /**
         * The rate an invoice for this step starts on, resolved from the client and
         * the account regime — the same service the unbilled-work rows get.
         */
        public int $vatRateBp,
        /** What the forfait has still to bill, so the dialog can show the room left. */
        public int $remainingCents,
    ) {}
}
