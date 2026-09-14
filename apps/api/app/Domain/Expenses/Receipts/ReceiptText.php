<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Receipts;

use Illuminate\Http\UploadedFile;
use Smalot\PdfParser\Config;
use Smalot\PdfParser\Parser;

/**
 * The text layer of a receipt, or null when there is none to read: images
 * (no OCR), oversized files, and PDFs the parser cannot open all leave the
 * form empty rather than failing the upload.
 */
final class ReceiptText
{
    private const int MAX_BYTES = 5 * 1024 * 1024;

    private const int PAGE_LIMIT = 3;

    private const int DECODE_MEMORY_LIMIT_BYTES = 2 * 1024 * 1024;

    private const int MAX_STREAMS = 32;

    /** The filters the parser decodes with no memory limit at all. */
    private const array UNBOUNDED_FILTERS = ['/RunLengthDecode', '/LZWDecode'];

    public static function from(UploadedFile $file): ?string
    {
        if ($file->guessExtension() !== 'pdf' || $file->getSize() > self::MAX_BYTES) {
            return null;
        }

        $bytes = $file->getContent();

        if (! self::isSafeToParse($bytes)) {
            return null;
        }

        $config = new Config;
        $config->setRetainImageContent(false);
        $config->setDecodeMemoryLimit(self::DECODE_MEMORY_LIMIT_BYTES);

        try {
            $text = new Parser(config: $config)->parseContent($bytes)->getText(self::PAGE_LIMIT);
        } catch (\Throwable) {
            // Malformed input reaches the parser's PHP internals as \Error too.
            return null;
        }

        return trim($text) === '' ? null : $text;
    }

    /**
     * The parser inflates every stream while opening the file, and its decode
     * limit caps one Flate stream at a time, so the page limit bounds nothing:
     * a few hundred kilobytes of PDF can decode past the worker's memory limit,
     * which is a fatal error no catch sees. A receipt's text layer is a handful
     * of small streams, so a file shaped otherwise is not worth reading.
     */
    private static function isSafeToParse(string $bytes): bool
    {
        if (substr_count($bytes, 'endstream') > self::MAX_STREAMS) {
            return false;
        }

        return array_all(self::UNBOUNDED_FILTERS, fn (string $filter): bool => ! str_contains($bytes, $filter));
    }
}
