<?php

declare(strict_types=1);

namespace App\Domain\Documents\Actions;

use App\Domain\Documents\Jobs\MoveDocumentToMediaDisk;
use Illuminate\Validation\ValidationException;
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
}
