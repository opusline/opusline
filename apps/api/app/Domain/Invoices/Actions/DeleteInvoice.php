<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Bank\Models\BankMatch;
use App\Domain\Invoices\Models\Invoice;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class DeleteInvoice
{
    public function __construct(private readonly LockInvoice $lockInvoice) {}

    public function handle(Invoice $invoice): void
    {
        $this->lockInvoice->handle($invoice, function (Invoice $locked): void {
            abort_if($locked->isWrittenInOpusline() && $locked->status->isIssued(), 409, __('invoices.cannot_delete_issued'));
            abort_unless($locked->isDeletable(), 409, __('invoices.cannot_delete_with_money'));

            // The filed PDF lives on the client's pile, not under the invoice, so no
            // foreign key takes it along: left behind, it would name an invoice that is gone.
            $document = $locked->attachedDocument();

            if ($document instanceof Media) {
                $document->delete();
            }

            // Only unvalidated suggestions can remain here; isDeletable refused the rest.
            BankMatch::query()->where('invoice_id', $locked->id)->delete();

            $locked->timeEntries()->update(['invoice_id' => null]);

            $locked->delete();
        });
    }
}
