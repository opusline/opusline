<?php

declare(strict_types=1);

namespace App\Domain\Documents\Actions;

use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DownloadDocument
{
    public function handle(Media $document): StreamedResponse
    {
        return Storage::disk($document->disk)->download(
            $document->getPathRelativeToRoot(),
            $document->file_name,
            // Private content must never be reused from a shared cache.
            ['Cache-Control' => 'no-store'],
        );
    }
}
