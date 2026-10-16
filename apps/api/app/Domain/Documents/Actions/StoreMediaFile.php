<?php

declare(strict_types=1);

namespace App\Domain\Documents\Actions;

use App\Domain\Documents\Jobs\MoveDocumentToMediaDisk;
use Illuminate\Validation\ValidationException;
use RuntimeException;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileNameNotAllowed;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * How a staged file enters a media collection: written to the local disk so
 * the request never waits on object storage, then moved by a queued job once
 * the row is committed. Documents, generated PDFs and receipts all go through
 * here; the small images (logo, signature) write to the media disk directly.
 */
class StoreMediaFile
{
    /**
     * @param  array<string, scalar>  $customProperties
     *
     * @throws ValidationException when the library refuses the name — a segment
     *                             such as « .php » inside it, which the mimes
     *                             rule cannot see because it only reads the last one
     */
    public function handle(HasMedia $model, string $path, string $fileName, string $collection, array $customProperties = []): Media
    {
        try {
            $media = $model
                ->addMedia($path)
                ->usingName(pathinfo($fileName, PATHINFO_FILENAME))
                ->usingFileName($fileName)
                ->withCustomProperties($customProperties)
                ->toMediaCollection($collection, 'local');
        } catch (FileNameNotAllowed) {
            throw ValidationException::withMessages(['file' => __('documents.file_name_not_allowed')]);
        }

        MoveDocumentToMediaDisk::dispatch($media);

        return $media;
    }

    /**
     * The same for bytes held in memory — a rendered PDF, a downloaded
     * invoice. Through a temp file rather than addMediaFromString(): only
     * addMedia() is on the HasMedia contract, and the library consumes the
     * file it is handed.
     *
     * @param  array<string, scalar>  $customProperties
     *
     * @throws ValidationException
     */
    public function fromContents(HasMedia $model, string $contents, string $fileName, string $collection, array $customProperties = []): Media
    {
        $source = tempnam(sys_get_temp_dir(), 'opusline-');

        if ($source === false) {
            throw new RuntimeException('Could not open a temporary file for the document.');
        }

        try {
            // A short write files a truncated document, which nothing downstream
            // would ever notice — the media row looks perfectly healthy.
            if (file_put_contents($source, $contents) !== strlen($contents)) {
                throw new RuntimeException('Could not write the document to a temporary file.');
            }

            return $this->handle($model, $source, $fileName, $collection, $customProperties);
        } finally {
            if (is_file($source)) {
                unlink($source);
            }
        }
    }
}
