<?php

declare(strict_types=1);

namespace App\Domain\Documents\Support;

use Illuminate\Http\UploadedFile;

/**
 * The name a stored file is filed under: the caller's choice or the upload's
 * own, whitespace collapsed, cut to what the media row can hold, with the
 * original extension kept whatever the base became.
 */
final class StoredFileName
{
    private const int MAX_BYTES = 255;

    private const int MAX_EXTENSION = 16;

    private const string FALLBACK_BASE = 'document';

    public static function for(UploadedFile $file, ?string $chosen = null): string
    {
        $chosen = self::collapseWhitespace($chosen ?? '');
        $source = $chosen === '' ? $file->getClientOriginalName() : $chosen;
        $base = self::collapseWhitespace(pathinfo($source, PATHINFO_FILENAME));

        if ($base === '') {
            $base = self::FALLBACK_BASE;
        }

        $extension = mb_substr($file->getClientOriginalExtension(), 0, self::MAX_EXTENSION);
        $suffix = $extension === '' ? '' : '.'.$extension;

        $room = self::MAX_BYTES - strlen($suffix);

        return mb_strcut($base, 0, max($room, 1)).$suffix;
    }

    private static function collapseWhitespace(string $value): string
    {
        return trim((string) preg_replace('/[\p{Z}\s]+/u', ' ', $value));
    }
}
