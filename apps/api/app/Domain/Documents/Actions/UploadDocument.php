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
    private const int MAX_STORED_FILE_NAME_BYTES = 255;

    private const int MAX_EXTENSION = 16;

    private const string FALLBACK_BASE = 'document';

    public function handle(HasMedia $model, UploadDocumentData $data): Media
    {
        $fileName = $this->storedFileName($data);

        $document = $model
            ->addMedia($data->file)
            ->usingName(pathinfo($fileName, PATHINFO_FILENAME))
            ->usingFileName($fileName)
            ->withCustomProperties(['category' => ($data->category ?? DocumentCategory::Other)->value])
            ->toMediaCollection('documents', 'local');

        MoveDocumentToMediaDisk::dispatch($document);

        return $document;
    }

    private function storedFileName(UploadDocumentData $data): string
    {
        $chosen = $this->collapseWhitespace($data->fileName ?? '');
        $source = $chosen === '' ? $data->file->getClientOriginalName() : $chosen;
        $base = $this->collapseWhitespace(pathinfo($source, PATHINFO_FILENAME));

        if ($base === '') {
            $base = self::FALLBACK_BASE;
        }

        $extension = mb_substr($data->file->getClientOriginalExtension(), 0, self::MAX_EXTENSION);
        $suffix = $extension === '' ? '' : '.'.$extension;

        $room = self::MAX_STORED_FILE_NAME_BYTES - strlen($suffix);

        return mb_strcut($base, 0, max($room, 1)).$suffix;
    }

    private function collapseWhitespace(string $value): string
    {
        return trim((string) preg_replace('/[\p{Z}\s]+/u', ' ', $value));
    }
}
