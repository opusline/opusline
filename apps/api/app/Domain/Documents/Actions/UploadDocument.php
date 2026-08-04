<?php

declare(strict_types=1);

namespace App\Domain\Documents\Actions;

use App\Domain\Documents\Data\UploadDocumentData;
use App\Domain\Documents\Enums\DocumentCategory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class UploadDocument
{
    public function handle(HasMedia $model, UploadDocumentData $data): Media
    {
        return $model
            ->addMedia($data->file)
            ->withCustomProperties(['category' => ($data->category ?? DocumentCategory::Other)->value])
            ->toMediaCollection('documents');
    }
}
