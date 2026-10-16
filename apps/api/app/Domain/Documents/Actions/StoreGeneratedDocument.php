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
        return $this->storeMediaFile->fromContents(
            $model,
            $contents,
            $fileName,
            'documents',
            ['category' => $category->value, ...$customProperties],
        );
    }
}
