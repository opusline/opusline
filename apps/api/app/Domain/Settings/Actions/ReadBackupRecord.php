<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Settings\Data\BackupRecordData;
use Carbon\CarbonImmutable;
use Carbon\Exceptions\InvalidFormatException;
use Illuminate\Support\Facades\Storage;

class ReadBackupRecord
{
    public const string FILE = 'opusline-backup.json';

    /**
     * The note opusline-backup.sh leaves in the uploads volume, or null when
     * there is none to read.
     *
     * Anything unreadable answers null rather than throwing: this file is
     * written by a shell script on the host and sits in a directory the user can
     * edit, so a truncated write or a hand-mangled line must degrade to "no
     * record" — the same screen that tells them how to take a backup.
     */
    public function handle(): ?BackupRecordData
    {
        $record = Storage::disk('instance')->json(self::FILE);

        if (! is_array($record)) {
            return null;
        }

        $takenAt = $record['taken_at'] ?? null;
        $archive = $record['archive'] ?? null;
        $bytes = $record['bytes'] ?? null;

        if (! is_string($takenAt) || ! is_string($archive) || ! is_int($bytes)) {
            return null;
        }

        try {
            return new BackupRecordData(CarbonImmutable::parse($takenAt), $archive, $bytes);
        } catch (InvalidFormatException) {
            return null;
        }
    }
}
