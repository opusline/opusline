<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/** A wording to preview before it is saved; either field left out falls back to the stored template. */
class PreviewEmailTemplateData extends Data
{
    public function __construct(
        #[Min(1), Max(255)]
        public ?string $subject = null,
        #[Min(1), Max(5000)]
        public ?string $body = null,
    ) {}
}
