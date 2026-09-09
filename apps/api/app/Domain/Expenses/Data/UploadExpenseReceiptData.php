<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Mimes;
use Spatie\LaravelData\Data;

class UploadExpenseReceiptData extends Data
{
    public function __construct(
        /** The justificatif as the supplier issued it: a PDF, or a photo of the ticket. */
        #[File, Mimes('pdf', 'jpg', 'jpeg', 'png', 'webp'), Max(20480)]
        public UploadedFile $file,
    ) {}
}
