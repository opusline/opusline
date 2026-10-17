<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/** The account's wording of one client e-mail; which placeholders it may use is checked by the action. */
class UpdateEmailTemplateData extends Data
{
    public function __construct(
        #[Min(1), Max(255)]
        public string $subject,
        #[Min(1), Max(5000)]
        public string $body,
    ) {}
}
