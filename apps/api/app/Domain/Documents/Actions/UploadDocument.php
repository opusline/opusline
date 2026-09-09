<?php

declare(strict_types=1);

namespace App\Domain\Documents\Actions;

use App\Domain\Documents\Data\UploadDocumentData;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Documents\Support\StoredFileName;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class UploadDocument
{
    public function __construct(private readonly StoreMediaFile $storeMediaFile) {}

    /**
     * @param  array<string, scalar>  $customProperties  Extra properties the calling domain
     *                                                   needs to find this document again.
     *                                                   Server-side only: never request input.
     */
    public function handle(HasMedia $model, UploadDocumentData $data, array $customProperties = []): Media
    {
        return $this->storeMediaFile->handle(
            $model,
            $data->file->getRealPath(),
            StoredFileName::for($data->file, $data->fileName),
            'documents',
            ['category' => ($data->category ?? DocumentCategory::Other)->value, ...$customProperties],
        );
    }
}
