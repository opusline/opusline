<?php

declare(strict_types=1);

namespace App\Domain\Settings\Data;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Mimes;
use Spatie\LaravelData\Data;

class UploadSignatureData extends Data
{
    public function __construct(
        #[File, Mimes('png'), Max(1024)]
        public UploadedFile $signature,
    ) {}
}
