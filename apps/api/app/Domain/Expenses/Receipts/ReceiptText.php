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
    private const int MAX_BYTES = 10 * 1024 * 1024;

    private const int PAGE_LIMIT = 3;

    private const int DECODE_MEMORY_LIMIT_BYTES = 16 * 1024 * 1024;

    public static function from(UploadedFile $file): ?string
    {
        if ($file->guessExtension() !== 'pdf' || $file->getSize() > self::MAX_BYTES) {
            return null;
        }

        // The parser inflates every stream while opening the file, so the page
        // limit bounds nothing on its own: a small PDF can decode to hundreds of
        // megabytes and exhaust the worker before the first page is read.
        $config = new Config;
        $config->setRetainImageContent(false);
        $config->setDecodeMemoryLimit(self::DECODE_MEMORY_LIMIT_BYTES);

        try {
            $text = new Parser(config: $config)->parseContent($file->getContent())->getText(self::PAGE_LIMIT);
        } catch (\Throwable) {
            // Malformed input reaches the parser's PHP internals as \Error too.
            return null;
        }

        return trim($text) === '' ? null : $text;
    }
}
