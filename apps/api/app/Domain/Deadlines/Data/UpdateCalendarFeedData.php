<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Data;

use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Data;

class UpdateCalendarFeedData extends Data
{
    public function __construct(
        #[BooleanType]
        public bool $invoices,
        #[BooleanType]
        public bool $reminders,
        #[BooleanType]
        public bool $vat,
        #[BooleanType]
        public bool $urssaf,
        #[BooleanType]
        public bool $other,
    ) {}
}
