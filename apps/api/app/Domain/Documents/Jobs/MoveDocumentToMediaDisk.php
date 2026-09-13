<?php

declare(strict_types=1);

namespace App\Domain\Documents\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldQueueAfterCommit;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use UnexpectedValueException;

/**
 * Moves a freshly written Media row's file onto the media disk.
 *
 * ShouldQueueAfterCommit, not just ShouldQueue: every connection is configured
 * after_commit => false, and the CRA lifecycle files its documents from inside
 * LockCra's transaction. A worker that popped the job before the COMMIT would find no
 * Media row and, under deleteWhenMissingModels, drop it without a failure record —
 * leaving the document stranded on the staging disk with nothing logged.
 */
class MoveDocumentToMediaDisk implements ShouldQueue, ShouldQueueAfterCommit
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 10;

    public bool $deleteWhenMissingModels = true;

    /**
     * The staging disk is captured now rather than read back off the model on each try:
     * a retry after the save but before the delete would see the row already pointing at
     * the target disk, take the early return, and leave the staged file behind for good.
     */
    public readonly string $stagingDisk;

    public function __construct(public Media $document)
    {
        $this->stagingDisk = $document->disk;
    }

    public function handle(): void
    {
        $targetDisk = config()->string('media-library.disk_name');
        $stagingDisk = $this->stagingDisk;

        if ($stagingDisk === $targetDisk) {
            return;
        }

        $path = $this->document->getPathRelativeToRoot();
        $stream = Storage::disk($stagingDisk)->readStream($path);

        if ($stream === null) {
            throw new UnexpectedValueException("Staged document [{$this->document->id}] is missing at [{$path}].");
        }

        try {
            $written = Storage::disk($targetDisk)->writeStream($path, $stream);
        } finally {
            if (is_resource($stream)) {
                fclose($stream);
            }
        }

        if ($written === false) {
            throw new UnexpectedValueException("Failed to write document [{$this->document->id}] to disk [{$targetDisk}].");
        }

        // The row may have been deleted under a running move — a document
        // removed, a receipt replaced, its expense deleted. The deletion
        // cleaned the staging copy; the one just written would stay behind
        // with nothing pointing at it. The row is re-read under lock so a
        // deletion cannot slip in between the check and the update: it either
        // ran before, and the copy goes, or waits and then cleans the moved
        // file itself.
        $moved = DB::transaction(function () use ($targetDisk): bool {
            $current = Media::query()->whereKey($this->document->id)->lockForUpdate()->first();

            if (! $current instanceof Media) {
                return false;
            }

            $current->disk = $targetDisk;
            $current->conversions_disk = $targetDisk;
            $current->save();

            return true;
        });

        if (! $moved) {
            Storage::disk($targetDisk)->delete($path);

            return;
        }

        Storage::disk($stagingDisk)->delete($path);
    }
}
