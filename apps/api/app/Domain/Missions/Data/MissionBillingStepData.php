<?php

declare(strict_types=1);

namespace App\Domain\Missions\Data;

use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Missions\Models\MissionBillingStep;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * One instalment of a fixed price, as the schedule shows it.
 */
class MissionBillingStepData extends Data
{
    public function __construct(
        public int $id,
        public string $label,
        public MoneyData $amount,
        public int $position,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $dueOn,
        /** Set when the project event behind the step has happened. */
        public bool $isReady,
        /** The invoice raised for it, or null while it is still to bill. */
        public ?int $invoiceId,
        /**
         * What that invoice is. A draft is a note to self, not a document: it holds
         * the step so a second invoice cannot be raised for it, but the row must not
         * claim the instalment is billed while every money figure excludes it.
         */
        public ?InvoiceStatus $invoiceStatus,
    ) {}

    public static function fromModel(MissionBillingStep $step): self
    {
        return new self(
            id: $step->id,
            label: $step->label,
            amount: MoneyData::fromMoney($step->amount_cents),
            position: $step->position,
            dueOn: $step->due_on,
            isReady: $step->ready_at !== null,
            invoiceId: $step->invoice_id,
            invoiceStatus: $step->invoice?->status,
        );
    }
}
