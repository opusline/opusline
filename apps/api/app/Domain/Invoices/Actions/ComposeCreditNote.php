<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\CreditNotes\CreditNoteDraft;
use App\Domain\Invoices\Data\CreditNoteLineInputData;
use App\Domain\Invoices\Data\IssueCreditNoteData;
use App\Domain\Invoices\Documents\DocumentTotals;
use App\Domain\Invoices\Enums\CreditNoteKind;
use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\InvoiceLine;
use App\Domain\Shared\Money\Rate;
use Cknow\Money\Money;
use Illuminate\Validation\ValidationException;

/**
 * Settles what a credit note on an invoice is: its lines, never more than is
 * left on the invoice, and what becomes of its amount.
 *
 * A full credit note takes the invoice's lines back as they were; a balance
 * one takes back what is left to pay; a partial one takes the lines the
 * editor sent. Up to what the client still owes, the invoice simply owes
 * less — nothing at all when the whole of an unpaid invoice is taken back.
 * Beyond it, the client paid money that is now owed back, and the editor
 * says whether it goes back by transfer or off a later invoice.
 */
class ComposeCreditNote
{
    /**
     * @param  bool  $isPreview  a preview has not chosen a settlement yet: it prints as a refund
     *
     * @throws ValidationException
     */
    public function handle(Invoice $invoice, IssueCreditNoteData $data, bool $isPreview = false): CreditNoteDraft
    {
        abort_unless($this->isCreditable($invoice), 409, __('credit_notes.invoice_not_creditable'));

        $invoice->loadMissing(['lines', 'user.settings']);
        $vatApplies = $invoice->user->settingsOrFail()->vat_regime->isLiable();

        $lines = match ($data->kind) {
            CreditNoteKind::Full => $this->fullLines($invoice),
            CreditNoteKind::Balance => $this->balanceLines($invoice),
            CreditNoteKind::Partial => $this->partialLines($invoice, $data->lines, $vatApplies),
        };
        $totals = DocumentTotals::of($lines, $invoice->currency);

        if (! $totals->ttc->isPositive()) {
            throw ValidationException::withMessages(['lines' => __('credit_notes.needs_positive_total')]);
        }

        if ($totals->ttc->greaterThan($invoice->creditableAmount())) {
            throw ValidationException::withMessages(['lines' => __('credit_notes.exceeds_invoice')]);
        }

        return new CreditNoteDraft(
            kind: $data->kind,
            reason: $data->reason,
            detail: blank($data->detail) ? null : trim($data->detail),
            settlement: $this->settlement($invoice, $totals->ttc, $data->settlement, $isPreview),
            language: $data->language ?? $invoice->language ?? DocumentLanguage::French,
            lines: $lines,
            totals: $totals,
        );
    }

    /** Only an invoice written and issued here, not already cancelled, takes a credit note. */
    private function isCreditable(Invoice $invoice): bool
    {
        return $invoice->isWrittenInOpusline()
            && in_array($invoice->status, [InvoiceStatus::Sent, InvoiceStatus::Paid], true);
    }

    private function settlement(Invoice $invoice, Money $ttc, ?CreditNoteSettlement $asked, bool $isPreview): CreditNoteSettlement
    {
        $due = $invoice->balanceDue();

        if ($ttc->lessThanOrEqual($due)) {
            return $ttc->equals($invoice->creditableAmount()) && $invoice->paidAmount()->isZero()
                ? CreditNoteSettlement::CancelsInvoice
                : CreditNoteSettlement::ReducesBalance;
        }

        // Beyond what is owed, the invoice cannot simply owe less: money goes back.
        if ($asked instanceof CreditNoteSettlement && $asked->returnsMoney()) {
            return $asked;
        }

        if ($isPreview) {
            return CreditNoteSettlement::Refund;
        }

        throw ValidationException::withMessages(['settlement' => __('credit_notes.settlement_required')]);
    }

    /**
     * @return list<array{label: string, detail: ?string, quantityMilli: int, unit: LineUnit, unitPrice: Money, vatRateBp: int, invoiceLineId: ?int}>
     */
    private function fullLines(Invoice $invoice): array
    {
        if (! $invoice->creditedAmount()->isZero()) {
            throw ValidationException::withMessages(['kind' => __('credit_notes.full_after_credit')]);
        }

        return array_values($invoice->lines->map(static fn (InvoiceLine $line): array => [
            'label' => $line->label,
            'detail' => $line->detail,
            'quantityMilli' => $line->quantity_milli,
            'unit' => $line->unit,
            'unitPrice' => $line->unit_price_cents,
            'vatRateBp' => $line->vat_rate_bp,
            'invoiceLineId' => $line->id,
        ])->all());
    }

    /**
     * One line for what is left to pay, at the invoice's one VAT rate: priced
     * so its total incl. VAT is the balance, or the cent below when the rate
     * cannot land on it exactly.
     *
     * @return list<array{label: string, detail: ?string, quantityMilli: int, unit: LineUnit, unitPrice: Money, vatRateBp: int, invoiceLineId: ?int}>
     */
    private function balanceLines(Invoice $invoice): array
    {
        $due = $invoice->balanceDue();

        if (! $due->isPositive()) {
            throw ValidationException::withMessages(['kind' => __('credit_notes.nothing_left_to_pay')]);
        }

        $rates = array_values(array_unique($invoice->lines->map(static fn (InvoiceLine $line): int => $line->vat_rate_bp)->all()));

        if (count($rates) > 1) {
            throw ValidationException::withMessages(['kind' => __('credit_notes.balance_mixed_rates')]);
        }

        $rateBp = $rates[0] ?? 0;
        $ht = Rate::netOf($due, $rateBp);

        while ($ht->add(Rate::of($ht, $rateBp))->greaterThan($due)) {
            $ht = $ht->subtract(new Money(1, $invoice->currency));
        }

        return [[
            'label' => (string) __('invoice_document.credit_note.balance_line', ['number' => (string) $invoice->number], $invoice->language?->locale() ?? 'fr'),
            'detail' => null,
            'quantityMilli' => 1000,
            'unit' => LineUnit::Flat,
            'unitPrice' => $ht,
            'vatRateBp' => $rateBp,
            'invoiceLineId' => null,
        ]];
    }

    /**
     * @param  list<CreditNoteLineInputData>  $inputs
     * @return list<array{label: string, detail: ?string, quantityMilli: int, unit: LineUnit, unitPrice: Money, vatRateBp: int, invoiceLineId: ?int}>
     */
    private function partialLines(Invoice $invoice, array $inputs, bool $vatApplies): array
    {
        if ($inputs === []) {
            throw ValidationException::withMessages(['lines' => __('credit_notes.needs_lines')]);
        }

        $invoiceLines = $invoice->lines->keyBy('id');
        $lines = [];

        foreach ($inputs as $index => $input) {
            $vatRateBp = $vatApplies ? $input->vatRateBp : 0;

            if ($input->invoiceLineId !== null) {
                $taken = $invoiceLines->get($input->invoiceLineId);

                if (! $taken instanceof InvoiceLine) {
                    throw ValidationException::withMessages(["lines.{$index}.invoiceLineId" => __('credit_notes.line_not_on_invoice')]);
                }

                // A line taken back is taken back at the rate it was invoiced at.
                $vatRateBp = $taken->vat_rate_bp;
            }

            $lines[] = [
                'label' => trim($input->label),
                'detail' => blank($input->detail) ? null : trim($input->detail),
                'quantityMilli' => $input->quantityMilli,
                'unit' => $input->unit,
                'unitPrice' => $input->unitPrice->toMoney(),
                'vatRateBp' => $vatRateBp,
                'invoiceLineId' => $input->invoiceLineId,
            ];
        }

        return $lines;
    }
}
