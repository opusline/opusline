<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\InvoiceLineInputData;
use App\Domain\Invoices\Data\QuoteBillingData;
use App\Domain\Invoices\Data\SaveInvoiceDraftData;
use App\Domain\Invoices\Documents\DocumentFormatter;
use App\Domain\Invoices\Documents\DocumentTotals;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Enums\QuoteBilling;
use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Invoices\Models\QuoteLine;
use App\Domain\Shared\Data\SignedMoneyData;
use App\Domain\Shared\Money\Rate;
use App\Domain\Users\Models\User;
use Cknow\Money\Money;

/**
 * Builds an invoice draft from an accepted quote: the deposit it asked for,
 * the balance once a deposit went out, or the whole of it at once. The
 * draft opens in the editor, where it can still be touched before it is
 * numbered.
 *
 * The deposit is taken per VAT rate off the quote's breakdown, so its VAT
 * follows each rate as on any invoice; the balance copies the quote's lines
 * and deducts every deposit already issued, per rate too, so the three
 * documents add up to the quote to the cent.
 */
class InvoiceQuote
{
    private const int WHOLE = 1000;

    public function __construct(
        private readonly LockQuote $lockQuote,
        private readonly SaveInvoiceDraft $saveInvoiceDraft,
    ) {}

    public function handle(User $user, Quote $quote, QuoteBilling $billing): Invoice
    {
        return $this->lockQuote->handle($quote, function (Quote $locked) use ($user, $billing): Invoice {
            $locked->load(['lines', 'invoices.lines', 'invoices.creditNotes.lines']);
            $this->assertAllowed($locked, $billing);

            $settings = $user->settingsOrFail();
            $language = $locked->language ?? DocumentLanguage::French;
            $format = new DocumentFormatter($language, $settings->date_format);
            $draft = new SaveInvoiceDraftData(
                clientId: $locked->client_id,
                paymentTermsDays: $locked->payment_terms_days,
                paymentTermsEndOfMonth: $locked->payment_terms_end_of_month,
                showIban: $settings->show_iban_on_invoices,
                showEmail: $locked->show_email,
                language: $language,
                lines: $this->lines($locked, $billing, $format),
                missionId: $locked->mission_id,
                title: $this->title($locked, $billing, $format),
                description: $locked->description,
                latePenaltyRateBp: $settings->late_penalty_rate_bp,
                customMentions: $locked->custom_mentions,
            );

            $invoice = $this->saveInvoiceDraft->handle($user, $draft);
            $invoice->update(['quote_id' => $locked->id, 'quote_billing' => $billing]);

            return $invoice;
        });
    }

    private function assertAllowed(Quote $quote, QuoteBilling $billing): void
    {
        abort_if($quote->status !== QuoteStatus::Accepted, 409, __('quotes.cannot_invoice_unless_accepted'));

        $allowed = QuoteBillingData::fromQuote($quote);
        $can = match ($billing) {
            QuoteBilling::Deposit => $allowed->canInvoiceDeposit,
            QuoteBilling::Balance => $allowed->canInvoiceBalance,
            QuoteBilling::Full => $allowed->canInvoiceFull,
        };

        abort_if(! $can, 409, __(match ($billing) {
            QuoteBilling::Deposit => 'quotes.deposit_already_invoiced',
            QuoteBilling::Balance => 'quotes.balance_needs_deposit',
            QuoteBilling::Full => 'quotes.already_invoiced',
        }));
    }

    /**
     * @return list<InvoiceLineInputData>
     */
    private function lines(Quote $quote, QuoteBilling $billing, DocumentFormatter $format): array
    {
        if ($billing === QuoteBilling::Deposit) {
            return $this->depositLines($quote, $format);
        }

        // A quote recorded from another tool has no lines: its figure is the line.
        if (! $quote->isWrittenInOpusline()) {
            return [new InvoiceLineInputData(
                label: $quote->title ?? (string) $quote->number,
                quantityMilli: self::WHOLE,
                unit: LineUnit::Flat,
                unitPrice: SignedMoneyData::fromMoney($quote->amount_ht_cents),
                vatRateBp: $quote->vat_rate_bp,
            )];
        }

        $lines = array_values($quote->lines->map(static fn (QuoteLine $line): InvoiceLineInputData => new InvoiceLineInputData(
            label: $line->label,
            quantityMilli: $line->quantity_milli,
            unit: $line->unit,
            unitPrice: SignedMoneyData::fromMoney($line->unit_price_cents),
            vatRateBp: $line->vat_rate_bp,
            detail: $line->detail,
        ))->all());

        if ($billing === QuoteBilling::Full) {
            return $lines;
        }

        foreach ($quote->invoices as $invoice) {
            if ($invoice->quote_billing !== QuoteBilling::Deposit || ! $invoice->status->isIssued() || $invoice->status === InvoiceStatus::Cancelled) {
                continue;
            }

            foreach ($this->basesByRate($invoice) as $rateBp => $base) {
                $lines[] = new InvoiceLineInputData(
                    label: $this->text($format, 'quote_invoice.deducted_line', ['number' => (string) $invoice->number, 'date' => $format->date($invoice->issued_on)]),
                    quantityMilli: self::WHOLE,
                    unit: LineUnit::Flat,
                    unitPrice: SignedMoneyData::fromMoney($base->negative()),
                    vatRateBp: $rateBp,
                );
            }
        }

        return $lines;
    }

    /**
     * One line per VAT rate: the deposit's share of that rate's base.
     *
     * @return list<InvoiceLineInputData>
     */
    private function depositLines(Quote $quote, DocumentFormatter $format): array
    {
        $rateBp = (int) $quote->deposit_rate_bp;
        $totals = DocumentTotals::of(array_values($quote->lines->map(static fn (QuoteLine $line): array => [
            'quantityMilli' => $line->quantity_milli,
            'unitPrice' => $line->unit_price_cents,
            'vatRateBp' => $line->vat_rate_bp,
        ])->all()), $quote->currency);
        $lines = [];

        foreach ($totals->vatBreakdown as $row) {
            $lines[] = new InvoiceLineInputData(
                label: $this->text($format, 'quote_invoice.deposit_line', ['rate' => $this->plainRate($format, $rateBp), 'number' => (string) $quote->number]),
                quantityMilli: self::WHOLE,
                unit: LineUnit::Flat,
                unitPrice: SignedMoneyData::fromMoney(Rate::of($row['base'], $rateBp)),
                vatRateBp: $row['rateBp'],
                detail: count($totals->vatBreakdown) > 1 ? $this->text($format, 'quote_invoice.deposit_line_detail', ['vat' => $format->rate($row['rateBp'])]) : null,
            );
        }

        return $lines;
    }

    /**
     * What a deposit invoice billed before tax, per VAT rate, net of what credit notes took back.
     *
     * @return array<int, Money>
     */
    private function basesByRate(Invoice $invoice): array
    {
        $bases = [];

        foreach ($invoice->lines as $line) {
            $bases[$line->vat_rate_bp] = ($bases[$line->vat_rate_bp] ?? new Money(0, $invoice->currency))->add($line->total_ht_cents);
        }

        // What a credit note took back of the deposit is no longer to deduct.
        foreach ($invoice->creditNotes as $creditNote) {
            foreach ($creditNote->lines as $line) {
                $bases[$line->vat_rate_bp] = ($bases[$line->vat_rate_bp] ?? new Money(0, $invoice->currency))->subtract($line->total_ht_cents);
            }
        }

        $bases = array_filter($bases, static fn (Money $base): bool => $base->isPositive());
        krsort($bases);

        return $bases;
    }

    private function title(Quote $quote, QuoteBilling $billing, DocumentFormatter $format): ?string
    {
        return match ($billing) {
            QuoteBilling::Full => $quote->title,
            QuoteBilling::Deposit => $this->text($format, 'quote_invoice.deposit_title', ['title' => $quote->title ?? (string) $quote->number]),
            QuoteBilling::Balance => $this->text($format, 'quote_invoice.balance_title', ['title' => $quote->title ?? (string) $quote->number]),
        };
    }

    private function plainRate(DocumentFormatter $format, int $rateBp): string
    {
        return rtrim($format->rate($rateBp), ' %');
    }

    /**
     * @param  array<string, string>  $replace
     */
    private function text(DocumentFormatter $format, string $key, array $replace): string
    {
        return (string) __("invoice_document.{$key}", $replace, $format->locale());
    }
}
