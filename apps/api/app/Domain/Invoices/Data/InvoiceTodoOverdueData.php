<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * The facts behind an invoice that was sent and has not come in.
 */
class InvoiceTodoOverdueData extends Data
{
    public function __construct(
        public int $invoiceId,
        public ?string $number,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $dueOn,
        public int $daysLate,
    ) {}
}
