<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\InvoiceTodoKind;
use App\Domain\Shared\Data\MoneyData;
use Spatie\LaravelData\Data;

/**
 * One row of "À traiter".
 *
 * What every row has — a kind, an amount and whose it is — sits here; what only one
 * kind has hangs off the matching sub-object, so `kind` and the shape agree by
 * construction rather than by convention.
 *
 * The amounts differ in nature: an overdue invoice is owed gross, unbilled time is
 * worth its net value.
 */
class InvoiceTodoData extends Data
{
    public function __construct(
        public InvoiceTodoKind $kind,
        public MoneyData $amount,
        public int $clientId,
        public string $clientName,
        public ?InvoiceTodoOverdueData $overdue = null,
        public ?InvoiceTodoWorkData $work = null,
        public ?InvoiceTodoStepData $step = null,
    ) {}
}
