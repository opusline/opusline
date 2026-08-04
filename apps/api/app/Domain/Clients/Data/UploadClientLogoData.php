<?php

declare(strict_types=1);

namespace App\Domain\Clients\Data;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Mimes;
use Spatie\LaravelData\Data;

class UploadClientLogoData extends Data
{
    public function __construct(
        #[File, Mimes('png', 'svg'), Max(2048)]
        public UploadedFile $logo,
    ) {}
}
