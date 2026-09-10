<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Mimes;
use Spatie\LaravelData\Data;

class UploadInvoiceDocumentData extends Data
{
    public function __construct(
        /** What a billing tool produces is a PDF, or a scan of one — never a spreadsheet. */
        #[File, Mimes('pdf', 'jpg', 'jpeg', 'png'), Max(20480)]
        public UploadedFile $file,
    ) {}
}
