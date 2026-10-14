<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\DocumentLanguage;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Data;

class InvoicePaperQueryData extends Data
{
    public function __construct(
        /** Defaults to the invoice's own language: a French invoice can still be downloaded in English. */
        #[Enum(DocumentLanguage::class)]
        public ?DocumentLanguage $language = null,
    ) {}
}
