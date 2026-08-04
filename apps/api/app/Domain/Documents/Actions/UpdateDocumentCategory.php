<?php

declare(strict_types=1);

namespace App\Domain\Documents\Actions;

use App\Domain\Documents\Data\UpdateDocumentData;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class UpdateDocumentCategory
{
    public function handle(Media $document, UpdateDocumentData $data): Media
    {
        $document->setCustomProperty('category', $data->category->value);
        $document->save();

        return $document;
    }
}
