<?php

declare(strict_types=1);

namespace App\Domain\Documents\Data;

use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Documents\Enums\DocumentSource;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Data;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use UnexpectedValueException;

class DocumentData extends Data
{
    public function __construct(
        public int $id,
        public string $fileName,
        public DocumentCategory $category,
        public DocumentSource $source,
        public int $sizeBytes,
        public CarbonImmutable $createdAt,
    ) {}

    public static function fromMedia(Media $media): self
    {
        $category = $media->getCustomProperty('category');

        if (! is_int($category)) {
            throw new UnexpectedValueException("Document media [{$media->id}] has no integer category property.");
        }

        if ($media->created_at === null) {
            throw new UnexpectedValueException("Document media [{$media->id}] has no creation date.");
        }

        return new self(
            id: $media->id,
            fileName: $media->file_name,
            category: DocumentCategory::from($category),
            source: match ($media->model_type) {
                'mission' => DocumentSource::Mission,
                'client' => DocumentSource::Client,
                'user' => DocumentSource::Personal,
                default => throw new UnexpectedValueException("Unexpected document owner type [{$media->model_type}]."),
            },
            sizeBytes: $media->size,
            createdAt: CarbonImmutable::instance($media->created_at),
        );
    }
}
