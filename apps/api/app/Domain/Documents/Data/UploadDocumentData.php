<?php

declare(strict_types=1);

namespace App\Domain\Documents\Data;

use App\Domain\Documents\Enums\DocumentCategory;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Mimes;
use Spatie\LaravelData\Data;

class UploadDocumentData extends Data
{
    public function __construct(
        #[File, Mimes('pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx', 'xls', 'xlsx', 'odt', 'ods', 'csv'), Max(20480)]
        public UploadedFile $file,
        public ?DocumentCategory $category = null,
        #[Max(255)]
        public ?string $fileName = null,
    ) {}
}
