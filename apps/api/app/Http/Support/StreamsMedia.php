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

        return Storage::disk($media->disk)->response(
            $media->getPathRelativeToRoot(),
            $media->file_name,
            [
                'Content-Security-Policy' => "default-src 'none'",
                'Cache-Control' => 'no-store',
            ],
        );
    }
}
