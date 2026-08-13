<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\Validation\BeforeOrEqual;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

class RemindInvoiceData extends Data
{
    public function __construct(
        #[DateFormat('Y-m-d'), BeforeOrEqual('today')]
        public ?string $occurredOn = null,
        #[Max(2000)]
        public ?string $note = null,
    ) {}
}
