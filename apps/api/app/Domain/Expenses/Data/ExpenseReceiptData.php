<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use Spatie\LaravelData\Data;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ExpenseReceiptData extends Data
{
    public function __construct(
        public int $id,
        public string $fileName,
        public int $sizeBytes,
    ) {}

    public static function fromMedia(Media $media): self
    {
        return new self(
            id: $media->id,
            fileName: $media->file_name,
            sizeBytes: $media->size,
        );
    }
}
