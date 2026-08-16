<?php

declare(strict_types=1);

namespace App\Domain\Bank\Parsing;

/**
 * Bank exports arrive in whatever encoding the bank's mainframe grew up with.
 * UTF-8 (with or without BOM) passes through; anything else is read as
 * Windows-1252, which covers the Latin-1 range French banks actually emit
 * plus € and œ.
 */
final class DecodeStatementText
{
    public static function decode(string $bytes): string
    {
        if (str_starts_with($bytes, "\xFF\xFE")) {
            return self::fromEncoding(substr($bytes, 2), 'UTF-16LE');
        }

        if (str_starts_with($bytes, "\xFE\xFF")) {
            return self::fromEncoding(substr($bytes, 2), 'UTF-16BE');
        }

        if (str_starts_with($bytes, "\xEF\xBB\xBF")) {
            $bytes = substr($bytes, 3);
        }

        if (mb_check_encoding($bytes, 'UTF-8')) {
            return $bytes;
        }

        return self::fromEncoding($bytes, 'Windows-1252');
    }

    private static function fromEncoding(string $bytes, string $encoding): string
    {
        $converted = mb_convert_encoding($bytes, 'UTF-8', $encoding);

        if (! is_string($converted)) {
            throw new StatementParseException('bank.unreadable_file');
        }

        return $converted;
    }
}
