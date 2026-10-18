<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\ReceiptReader;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Mimes;
use Spatie\LaravelData\Data;

class ReadReceiptData extends Data
{
    public function __construct(
        /** The receipt to read before it is attached to anything. */
        #[File, Mimes('pdf', 'jpg', 'jpeg', 'png', 'webp'), Max(20480)]
        public UploadedFile $file,
        /**
         * Who should read it. Left out, Claude does when the account gave a
         * key; Heuristics keeps the file on the server even then.
         */
        #[Enum(ReceiptReader::class)]
        public ?ReceiptReader $reader = null,
    ) {}
}
