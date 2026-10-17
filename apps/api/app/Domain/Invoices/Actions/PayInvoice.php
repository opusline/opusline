<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Bank\Models\BankMovement;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Lifecycle\Invoice\InvoicePaid;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\InvoicePayment;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;

/**
 * Records money landing on an invoice. The payment that brings the balance to
 * zero moves the invoice to Paid; one that leaves something due is recorded
 * and the invoice stays Sent, partly paid.
 */
class PayInvoice
{
    public function __construct(
        private readonly LockInvoice $lockInvoice,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
    ) {}

    /**
     * @param  ?Money  $amount  what landed; null for the whole balance still due
     * @param  ?BankMovement  $movement  the bank movement an accepted match pays it with
     */
    public function handle(Invoice $invoice, CarbonImmutable $paidOn, ?Money $amount = null, ?BankMovement $movement = null): InvoicePayment
    {
        return $this->lockInvoice->handle($invoice, function (Invoice $locked) use ($paidOn, $amount, $movement): InvoicePayment {
            // A paid invoice takes no more money: correcting its payment goes
            // through its payments, which is where the dates and amounts live.
            abort_unless($locked->status === InvoiceStatus::Sent, 409, __('invoices.cannot_pay_unless_sent'));
            abort_if($paidOn->isBefore($locked->issued_on), 409, __('invoices.paid_on_before_issued'));

            $balance = $locked->balanceDue();
            $paid = $amount ?? $balance;

            abort_unless($paid->isPositive(), 409, __('invoices.payment_not_positive'));
            abort_if($paid->greaterThan($balance), 409, __('invoices.payment_exceeds_balance'));

            $payment = $locked->payments()->create([
                'user_id' => $locked->user_id,
                'currency' => $locked->currency,
                'amount_cents' => $paid,
                'paid_on' => $paidOn,
                'bank_movement_id' => $movement?->id,
            ]);

            if ($paid->equals($balance)) {
                $locked->lifecycle->transitionTo(InvoicePaid::class);
                $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::Paid, $paidOn);
            } else {
                $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::PaymentRecorded, $paidOn, (string) $paid->getAmount());
            }

            return $payment;
        });
    }
}
