<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Documents\Actions\UploadDocument;
use App\Domain\Documents\Data\UploadDocumentData;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Invoices\Data\UploadInvoiceDocumentData;
use App\Domain\Invoices\Models\Quote;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * File the PDF a quote recorded from another tool actually is. A quote
 * Opusline validated already filed its own; no other may stand in for it.
 */
class AttachQuoteDocument
{
    public function __construct(
        private readonly LockQuote $lockQuote,
        private readonly UploadDocument $uploadDocument,
    ) {}

    public function handle(Quote $quote, UploadInvoiceDocumentData $data): Media
    {
        return $this->lockQuote->handle($quote, function (Quote $locked) use ($data): Media {
            abort_if($locked->isWrittenInOpusline(), 409, __('quotes.document_is_opuslines'));
            // One document per quote: a re-upload is a correction, not a second copy.
            $locked->attachedDocument()?->delete();

            return $this->uploadDocument->handle(
                $locked->client,
                new UploadDocumentData(
                    file: $data->file,
                    category: DocumentCategory::Quote,
                    fileName: $locked->number,
                ),
                $locked->documentProperties(),
            );
        });
    }
}
