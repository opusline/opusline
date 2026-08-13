<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\InvoiceTodoKind;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * One row of "À traiter". The two kinds carry different facts, so most fields are
 * nullable and the kind says which ones are filled: an overdue invoice has a
 * reference and a due date, unbilled work has a mission and the entries behind it.
 *
 * Amounts differ in nature too — an overdue invoice is owed gross, unbilled time is
 * worth its net value.
 */
class InvoiceTodoData extends Data
{
    /**
     * @param  list<int>  $timeEntryIds  What creating the invoice would mark as billed.
     *                                   Empty on an overdue row: the work is already on
     *                                   an invoice, it is the payment that is missing.
     */
    public function __construct(
        public InvoiceTodoKind $kind,
        public MoneyData $amount,
        public int $clientId,
        public string $clientName,
        public ?int $invoiceId,
        public ?string $number,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $dueOn,
        public ?int $daysLate,
        public ?int $missionId,
        public ?string $missionName,
        public ?int $entryCount,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $firstEntryOn,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $lastEntryOn,
        /** Billed quantity, in the mission's own unit — one of the two is set. */
        public ?float $valuedDays,
        public ?int $valuedMinutes,
        public array $timeEntryIds,
    ) {}
}
