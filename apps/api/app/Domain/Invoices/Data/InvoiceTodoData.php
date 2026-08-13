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
 * One row of "À traiter". Which id is set depends on the kind: an invoice to send or
 * chase carries invoiceId, unbilled time carries the missionId it sits on.
 */
class InvoiceTodoData extends Data
{
    public function __construct(
        public InvoiceTodoKind $kind,
        public ?int $invoiceId,
        public ?int $missionId,
        public MoneyData $amount,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $dueOn,
        /** Time entries behind an unbilled row; 1 for a single invoice. */
        public int $count,
    ) {}
}
