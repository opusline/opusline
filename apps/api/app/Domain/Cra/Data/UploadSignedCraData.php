<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use App\Domain\Shared\Validation\BeforeOrEqualAccountToday;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Mimes;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class UploadSignedCraData extends Data
{
    public function __construct(
        /** What comes back from a client is a scan or a PDF, never a spreadsheet. */
        #[File, Mimes('pdf', 'jpg', 'jpeg', 'png'), Max(20480)]
        public UploadedFile $file,
        #[DateFormat('Y-m-d'), Rule(new BeforeOrEqualAccountToday)]
        public ?string $signedOn = null,
    ) {}
}
