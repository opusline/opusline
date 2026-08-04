<?php

declare(strict_types=1);

namespace App\Domain\Documents\Actions;

use Spatie\MediaLibrary\MediaCollections\Models\Media;

class DeleteDocument
{
    public function handle(Media $document): void
    {
        $document->delete();
    }
}
