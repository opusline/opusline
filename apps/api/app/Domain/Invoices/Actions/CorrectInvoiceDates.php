<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\CorrectInvoiceDatesData;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\InvoiceEvent;
use Carbon\CarbonImmutable;
use Illuminate\Validation\ValidationException;

/**
 * Put the record straight on when an invoice went out and when it was settled.
 *
 * The transitions themselves stay one-way — this never sends or unpays anything.
 * It only moves the two dates an issued invoice already has, which is what a
 * client's "you sent it when?" and a bank statement read a fortnight late both
 * end up asking for.
 */
class CorrectInvoiceDates
{
    public function __construct(
        private readonly LockInvoice $lockInvoice,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
    ) {}

    public function handle(Invoice $invoice, CorrectInvoiceDatesData $data): Invoice
    {
        return $this->lockInvoice->handle($invoice, function (Invoice $locked) use ($data): Invoice {
            abort_if(! $locked->status->isIssued(), 409, __('invoices.cannot_correct_dates_unless_issued'));

            $this->assertSomethingToCorrect($data);

            $sentOn = $data->sentOn === null ? null : CarbonImmutable::parse($data->sentOn);
            $paidOn = $data->paidOn === null ? null : CarbonImmutable::parse($data->paidOn);

            abort_if(
                $paidOn instanceof CarbonImmutable && $locked->status !== InvoiceStatus::Paid,
                409,
                __('invoices.paid_on_without_payment'),
            );

            $this->assertDatesStayInOrder($locked, $sentOn, $paidOn);

            if ($sentOn instanceof CarbonImmutable) {
                $this->stampSentOn($locked, $sentOn);
            }

            if ($paidOn instanceof CarbonImmutable) {
                $this->stampPaidOn($locked, $paidOn);
            }

            return $locked;
        });
    }

    private function assertSomethingToCorrect(CorrectInvoiceDatesData $data): void
    {
        if ($data->sentOn !== null || $data->paidOn !== null) {
            return;
        }

        throw ValidationException::withMessages([
            'sentOn' => __('invoices.correction_needs_a_date'),
            'paidOn' => __('invoices.correction_needs_a_date'),
        ]);
    }

    /**
     * An invoice is issued, then sent, then paid, and a correction to one date must
     * not push it past the neighbours it did not name. The stored values stand in
     * for whatever the request left out.
     */
    private function assertDatesStayInOrder(Invoice $invoice, ?CarbonImmutable $sentOn, ?CarbonImmutable $paidOn): void
    {
        $effectiveSentOn = $sentOn ?? $this->recordedSentOn($invoice);
        $effectivePaidOn = $paidOn ?? $invoice->paid_on;

        abort_if(
            $effectiveSentOn->isBefore($invoice->issued_on),
            409,
            __('invoices.sent_on_before_issued'),
        );

        abort_if(
            $effectivePaidOn instanceof CarbonImmutable && $effectivePaidOn->isBefore($effectiveSentOn),
            409,
            __('invoices.paid_on_before_sent'),
        );
    }

    /**
     * The send date has no column of its own: the Sent event is where it is written
     * down, and the drawer's history reads it straight back.
     */
    private function stampSentOn(Invoice $invoice, CarbonImmutable $sentOn): void
    {
        $invoice->events()->updateOrCreate(
            ['kind' => InvoiceEventKind::Sent],
            ['occurred_on' => $sentOn],
        );
    }

    private function stampPaidOn(Invoice $invoice, CarbonImmutable $paidOn): void
    {
        if ($invoice->paid_on instanceof CarbonImmutable && $paidOn->equalTo($invoice->paid_on)) {
            return;
        }

        $invoice->update(['paid_on' => $paidOn]);

        $invoice->events()->updateOrCreate(
            ['kind' => InvoiceEventKind::Paid],
            ['occurred_on' => $paidOn],
        );

        // Same rule as UpdateInvoice: moving the payment date moves revenue between
        // declaration periods, so the correction is itself part of the history — dated
        // the day it was made, not the day it moved the money to.
        $this->recordInvoiceEvent->handle($invoice, InvoiceEventKind::Updated);
    }

    /**
     * The date the Sent event carries, or the issue date for an invoice recorded as
     * already sent without one — CreateInvoice stamps that event on the issue date,
     * so the fallback is the same answer by another route.
     */
    private function recordedSentOn(Invoice $invoice): CarbonImmutable
    {
        $sent = $invoice->events()->where('kind', InvoiceEventKind::Sent)->first();

        return $sent instanceof InvoiceEvent ? $sent->occurred_on : $invoice->issued_on;
    }
}
