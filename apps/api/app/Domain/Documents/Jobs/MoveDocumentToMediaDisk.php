<?php

declare(strict_types=1);

namespace App\Domain\Documents\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use UnexpectedValueException;

class MoveDocumentToMediaDisk implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 10;

    public bool $deleteWhenMissingModels = true;

    public function __construct(public Media $document) {}

    public function handle(): void
    {
        $targetDisk = config()->string('media-library.disk_name');
        $stagingDisk = $this->document->disk;

        if ($stagingDisk === $targetDisk) {
            return;
        }

        $path = $this->document->getPathRelativeToRoot();
        $stream = Storage::disk($stagingDisk)->readStream($path);

        if ($stream === null) {
            throw new UnexpectedValueException("Staged document [{$this->document->id}] is missing at [{$path}].");
        }

        Storage::disk($targetDisk)->writeStream($path, $stream);

        $this->document->disk = $targetDisk;
        $this->document->conversions_disk = $targetDisk;
        $this->document->save();

        Storage::disk($stagingDisk)->delete($path);
    }
}
