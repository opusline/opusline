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
                'Content-Security-Policy' => $this->contentSecurityPolicyFor($media),
                'Cache-Control' => 'no-store',
            ],
        );
    }

    /**
     * An SVG opened on its own is a document on the app's origin: sandboxed, it
     * can neither run script nor submit a form. Only SVGs, because Chrome
     * refuses to render a PDF inside a sandbox, and receipts open inline.
     */
    private function contentSecurityPolicyFor(Media $media): string
    {
        return $media->mime_type === 'image/svg+xml'
            ? "default-src 'none'; style-src 'unsafe-inline'; sandbox"
            : "default-src 'none'";
    }
}
