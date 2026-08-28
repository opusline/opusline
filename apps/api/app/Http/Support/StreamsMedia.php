<?php

declare(strict_types=1);

namespace App\Http\Support;

use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;

trait StreamsMedia
{
    private function streamSingleFile(HasMedia $owner, string $collection): StreamedResponse
    {
        $media = $owner->getMedia($collection)->first();

        abort_if(! $media instanceof Media, 404);

        $disk = Storage::disk($media->disk);

        // See DownloadDocument: the row is not proof the object is still there,
        // and a missing one breaks the stream after the headers have gone out.
        abort_if($disk->missing($media->getPathRelativeToRoot()), 404);

        return $disk->response(
            $media->getPathRelativeToRoot(),
            $media->file_name,
            [
                'Content-Security-Policy' => "default-src 'none'",
                'Cache-Control' => 'no-store',
            ],
        );
    }
}
