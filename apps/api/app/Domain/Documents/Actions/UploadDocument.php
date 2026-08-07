<?php

declare(strict_types=1);

namespace App\Domain\Documents\Actions;

use App\Domain\Documents\Data\UploadDocumentData;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Documents\Jobs\MoveDocumentToMediaDisk;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class UploadDocument
{
    private const int MAX_STORED_FILE_NAME = 255;

    public function handle(HasMedia $model, UploadDocumentData $data): Media
    {
        $adder = $model->addMedia($data->file);
        $renamed = $this->renamedFile($data);

        if ($renamed !== null) {
            $adder->usingName(pathinfo($renamed, PATHINFO_FILENAME))->usingFileName($renamed);
        }

        $document = $adder
            ->withCustomProperties(['category' => ($data->category ?? DocumentCategory::Other)->value])
            ->toMediaCollection('documents', 'local');

        MoveDocumentToMediaDisk::dispatch($document);

        return $document;
    }

    private function renamedFile(UploadDocumentData $data): ?string
    {
        $chosen = trim($data->fileName ?? '');

        if ($chosen === '') {
            return null;
        }

        $base = pathinfo($chosen, PATHINFO_FILENAME);
        $extension = $data->file->getClientOriginalExtension();

        if ($base === '') {
            return null;
        }

        $room = self::MAX_STORED_FILE_NAME - mb_strlen($extension) - 1;

        return mb_substr($base, 0, max($room, 1)).'.'.$extension;
    }
}
