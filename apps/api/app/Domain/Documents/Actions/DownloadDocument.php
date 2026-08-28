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
        $disk = Storage::disk($document->disk);

        // A row can outlive its object: a database restored without its bucket, a
        // manual delete. The disks run with `throw => false`, so the missing object
        // is not an exception the router could turn into a 404 — it is a response
        // whose headers are already sent when the stream fails. Ask first.
        abort_if($disk->missing($document->getPathRelativeToRoot()), 404);

        return $disk->download(
            $document->getPathRelativeToRoot(),
            $document->file_name,
            // Private content must never be reused from a shared cache.
            ['Cache-Control' => 'no-store'],
        );
    }
}
