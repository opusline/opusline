<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Models\Invoice;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class DetachInvoiceDocument
{
    public function __construct(private readonly LockInvoice $lockInvoice) {}

    public function handle(Invoice $invoice): void
    {
        $this->lockInvoice->handle($invoice, function (Invoice $locked): void {
            $document = $locked->attachedDocument();

            abort_if(! $document instanceof Media, 404);

            $document->delete();
        });
    }
}
