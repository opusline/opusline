<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Lifecycle\Invoice\InvoiceSent;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\InvoicePayment;

/**
 * Takes a payment back off an invoice: a transfer recorded by mistake, or a
 * bank match that was accepted on the wrong invoice. A paid invoice goes back
 * to Sent, and a movement the payment came from is unlinked so it can be
 * matched again.
 */
class RemoveInvoicePayment
{
    public function __construct(
        private readonly LockInvoice $lockInvoice,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
    ) {}

    public function handle(Invoice $invoice, InvoicePayment $payment): Invoice
    {
        return $this->lockInvoice->handle($invoice, function (Invoice $locked) use ($payment): Invoice {
            abort_unless($payment->invoice_id === $locked->id, 404);

            $this->unlinkMovement($locked, $payment);
            $payment->delete();

            if ($locked->status === InvoiceStatus::Paid) {
                $locked->lifecycle->transitionTo(InvoiceSent::class);
                $locked->events()->where('kind', InvoiceEventKind::Paid)->delete();
            }

            // Money that was declared in a period is no longer there: history.
            $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::Updated);

            return $locked;
        });
    }

    /** The match that paid it is dismissed rather than deleted: its row says the pair was looked at. */
    private function unlinkMovement(Invoice $invoice, InvoicePayment $payment): void
    {
        if ($payment->bank_movement_id === null) {
            return;
        }

        $invoice->user->bankMovements()->whereKey($payment->bank_movement_id)->update(['invoice_id' => null]);
        $invoice->user->bankMatches()
            ->where('bank_movement_id', $payment->bank_movement_id)
            ->where('invoice_id', $invoice->id)
            ->update(['status' => BankMatchStatus::Dismissed]);
    }
}
