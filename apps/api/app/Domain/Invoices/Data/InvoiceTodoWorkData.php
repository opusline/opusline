<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * The facts behind tracked time that no invoice covers yet: what would be billed,
 * over which days, and which entries creating the invoice would mark as billed.
 */
class InvoiceTodoWorkData extends Data
{
    /**
     * @param  list<int>  $timeEntryIds
     * @param  ?float  $valuedDays  Billed quantity in the mission's own unit — exactly
     *                              one of days or minutes is set.
     * @param  int  $vatRateBp  The rate an invoice for this row starts on, resolved from
     *                          the client and the account regime. Sent so the create
     *                          dialog prefills it instead of re-deriving the fiscal rule.
     */
    public function __construct(
        public int $missionId,
        public string $missionName,
        public int $entryCount,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $firstEntryOn,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $lastEntryOn,
        public ?float $valuedDays,
        public ?int $valuedMinutes,
        public array $timeEntryIds,
        public int $vatRateBp,
    ) {}
}
