<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\UpdateInvoiceData;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

class UpdateInvoice
{
    /**
     * Changes to any of these are fiscal history: they move money or move the period
     * the money is declared in. A reworded note is not.
     *
     * @var list<string>
     */
    private const array HISTORIC_ATTRIBUTES = [
        'amount_ht_cents',
        'amount_ttc_cents',
        'vat_rate_bp',
        'issued_on',
    ];

    public function __construct(
        private readonly LockInvoice $lockInvoice,
        private readonly ValidateInvoice $validateInvoice,
        private readonly ComputeInvoiceAmounts $computeInvoiceAmounts,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
    ) {}

    public function handle(User $user, Invoice $invoice, UpdateInvoiceData $data): Invoice
    {
        // Its totals come from its lines: only the editor may change an Opusline invoice.
        abort_if($invoice->isWrittenInOpusline(), 409, __('invoices.written_in_opusline'));

        return $this->lockInvoice->handle($invoice, function (Invoice $locked) use ($user, $data): Invoice {
            // An omitted issue date keeps the stored one. The validator is given the
            // same resolved value, so it cannot disagree about what is being saved.
            $issuedOn = $data->issuedOn === null
                ? $locked->issued_on
                : CarbonImmutable::parse($data->issuedOn);

            $this->validateInvoice->forUpdate($user, $data, $locked, $issuedOn);

            $client = $user->clients()->whereKey($data->clientId)->firstOrFail();
            $vatRateBp = $data->vatRateBp ?? $locked->vat_rate_bp;
            $amountHt = $data->amountHt->toMoney();

            $locked->fill([
                'client_id' => $client->id,
                'mission_id' => $data->missionId,
                'number' => $data->number,
                'issued_on' => $issuedOn,
                'due_on' => $data->dueOn ?? $issuedOn->addDays($client->payment_terms_days),
                'period_start' => $data->periodStart,
                'period_end' => $data->periodEnd,
                'currency' => $data->amountHt->currency->value,
                'amount_ht_cents' => $amountHt,
                'amount_ttc_cents' => $data->amountTtc?->toMoney()
                    ?? $this->computeInvoiceAmounts->ttcFor($amountHt, $vatRateBp),
                'vat_rate_bp' => $vatRateBp,
                'notes' => $data->notes,
            ]);

            $corrected = $locked->isDirty(self::HISTORIC_ATTRIBUTES);

            $locked->save();

            $corrected = $this->syncPayment($locked, $data->paidOn) || $corrected;

            if ($corrected) {
                $this->recordInvoiceEvent->handle($locked, InvoiceEventKind::Updated);
            }

            return $locked;
        });
    }

    /**
     * An invoice recorded from another tool is paid whole, on one day: its one
     * payment follows the date and the amount of each edit. Returns whether it moved.
     */
    private function syncPayment(Invoice $invoice, ?string $paidOn): bool
    {
        if ($invoice->status !== InvoiceStatus::Paid || $paidOn === null) {
            return false;
        }

        $payments = $invoice->payments()->get();

        if ($payments->count() !== 1) {
            abort_if(
                $invoice->paidOn()?->toDateString() !== $paidOn || ! $invoice->balanceDue()->isZero(),
                409,
                __('invoices.paid_on_many_payments'),
            );

            return false;
        }

        $payment = $payments->sole();
        $moved = $payment->paid_on->toDateString() !== $paidOn
            || ! $payment->amount_cents->equals($invoice->amount_ttc_cents);

        if ($moved) {
            $payment->update(['paid_on' => CarbonImmutable::parse($paidOn), 'amount_cents' => $invoice->amount_ttc_cents]);
            $invoice->events()->where('kind', InvoiceEventKind::Paid)->update(['occurred_on' => $paidOn]);
        }

        return $moved;
    }
}
