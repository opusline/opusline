<?php

declare(strict_types=1);

namespace App\Domain\Documents\Actions;

use App\Domain\Documents\Enums\DocumentCategory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * File a document Opusline produced itself.
 *
 * UploadDocument takes an UploadedFile, which a rendered PDF never is. The custom
 * property and the move to the media disk are the same either way, so they live here
 * rather than being copied into whichever domain did the rendering.
 */
class StoreGeneratedDocument
{
    public function __construct(private readonly StoreMediaFile $storeMediaFile) {}

    /**
     * @param  array<string, scalar>  $customProperties  Extra properties the calling domain
     *                                                   needs to find this document again.
     *                                                   Server-side only: never request input.
     */
    public function handle(HasMedia $model, string $contents, string $fileName, DocumentCategory $category, array $customProperties = []): Media
    {
        // Through a temp file rather than addMediaFromString(): only addMedia() is on the
        // HasMedia contract, and the media library consumes the file it is handed.
        $source = tempnam(sys_get_temp_dir(), 'opusline-');

        if ($source === false) {
            throw new \RuntimeException('Could not open a temporary file for the generated document.');
        }

        // A short write files a truncated PDF as the archived document, which nothing
        // downstream would ever notice — the media row looks perfectly healthy.
        if (file_put_contents($source, $contents) !== strlen($contents)) {
            unlink($source);

            throw new \RuntimeException('Could not write the generated document to a temporary file.');
        }

        return $this->storeMediaFile->handle(
            $model,
            $source,
            $fileName,
            'documents',
            ['category' => $category->value, ...$customProperties],
        );
    }
}
