<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Documents\Actions\UploadDocument;
use App\Domain\Documents\Data\UploadDocumentData;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Invoices\Data\UploadInvoiceDocumentData;
use App\Domain\Invoices\Models\Invoice;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * File the document the invoice actually is.
 *
 * Opusline never produces it — the billing tool does — so until it is filed here the
 * only copy lives in someone's downloads folder. Only an issued invoice has one: a
 * draft is a note to self, and there is nothing yet to attach.
 */
class AttachInvoiceDocument
{
    public function __construct(
        private readonly LockInvoice $lockInvoice,
        private readonly UploadDocument $uploadDocument,
    ) {}

    public function handle(Invoice $invoice, UploadInvoiceDocumentData $data): Media
    {
        return $this->lockInvoice->handle($invoice, function (Invoice $locked) use ($data): Media {
            abort_if(! $locked->status->isIssued(), 409, __('invoices.cannot_attach_document_unless_issued'));

            // One document per invoice: a re-upload is a correction, not a second copy.
            $locked->attachedDocument()?->delete();

            return $this->uploadDocument->handle(
                $locked->client,
                new UploadDocumentData(
                    file: $data->file,
                    category: DocumentCategory::IssuedInvoice,
                    fileName: $locked->number,
                ),
                $locked->documentProperties(),
            );
        });
    }
}
