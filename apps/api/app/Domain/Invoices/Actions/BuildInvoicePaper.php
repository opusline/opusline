<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\InvoicePaperData;
use App\Domain\Invoices\Data\PaperLineData;
use App\Domain\Invoices\Data\PaperLineHeadData;
use App\Domain\Invoices\Data\PaperPartyData;
use App\Domain\Invoices\Data\PaperRowData;
use App\Domain\Invoices\Data\PaperTotalData;
use App\Domain\Invoices\Data\PaperVatHeadData;
use App\Domain\Invoices\Data\PaperVatRowData;
use App\Domain\Invoices\Data\SaveInvoiceDraftData;
use App\Domain\Invoices\Documents\DocumentFormatter;
use App\Domain\Invoices\Documents\DocumentParties;
use App\Domain\Invoices\Documents\DocumentTotals;
use App\Domain\Invoices\Documents\PaperDocument;
use App\Domain\Invoices\Documents\PaymentTerm;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\OperationCategory;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Models\InvoiceLine;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

/**
 * Resolves an invoice into its printed sheet (InvoicePaperData), in the
 * language asked for. A draft prints the account's live identity under a
 * « Brouillon » stamp; an issued invoice prints the parties it was issued
 * with.
 *
 * @phpstan-import-type Party from DocumentParties
 */
class BuildInvoicePaper
{
    public function forInvoice(Invoice $invoice, DocumentLanguage $language): InvoicePaperData
    {
        $invoice->loadMissing(['client', 'lines', 'user.settings', 'user.media']);
        $user = $invoice->user;
        $settings = $user->settingsOrFail();
        $isIssued = $invoice->status->isIssued();

        /** @var Party $seller */
        $seller = $isIssued && $invoice->seller_snapshot !== null
            ? $invoice->seller_snapshot
            : DocumentParties::seller($settings, $invoice->show_iban, $invoice->show_email);
        /** @var Party $buyer */
        $buyer = $isIssued && $invoice->buyer_snapshot !== null
            ? $invoice->buyer_snapshot
            : DocumentParties::buyer($invoice->client);

        return $this->build(new PaperDocument(
            number: $invoice->number,
            issuedOn: $invoice->issued_on,
            dueOn: $invoice->due_on,
            periodStart: $invoice->period_start,
            periodEnd: $invoice->period_end,
            title: $invoice->title,
            description: $invoice->description,
            operationCategory: $isIssued ? ($invoice->operation_category ?? OperationCategory::Services) : $settings->operation_category,
            seller: $seller,
            buyer: $buyer,
            lines: array_values($invoice->lines->map(static fn (InvoiceLine $line): array => [
                'label' => $line->label,
                'detail' => $line->detail,
                'quantityMilli' => $line->quantity_milli,
                'unit' => $line->unit,
                'unitPrice' => $line->unit_price_cents,
                'vatRateBp' => $line->vat_rate_bp,
            ])->all()),
            currency: $invoice->currency,
            term: new PaymentTerm($invoice->payment_terms_days ?? 0, $invoice->payment_terms_end_of_month),
            latePenaltyRateBp: $invoice->late_penalty_rate_bp,
            showIban: $invoice->show_iban,
            vatOnDebits: $isIssued ? $invoice->vat_on_debits : ($settings->vat_regime->isLiable() && $settings->vat_on_debits),
            customMentions: $invoice->custom_mentions,
            hasLogo: $user->hasMedia('company_logo'),
        ), new DocumentFormatter($language, $settings->date_format), $isIssued ? null : 'draft');
    }

    /** The sheet of an editor draft that was never saved: the live preview. */
    public function forDraft(User $user, SaveInvoiceDraftData $data): InvoicePaperData
    {
        $settings = $user->settingsOrFail();
        $client = $user->clients()->whereKey($data->clientId)->firstOrFail();
        $vatApplies = $settings->vat_regime->isLiable();
        $issuedOn = $data->issuedOn === null ? $settings->today() : CarbonImmutable::parse($data->issuedOn);
        $term = new PaymentTerm($data->paymentTermsDays, $data->paymentTermsEndOfMonth);
        $lines = [];

        foreach ($data->lines as $line) {
            $lines[] = [
                'label' => $line->label,
                'detail' => $line->detail,
                'quantityMilli' => $line->quantityMilli,
                'unit' => $line->unit,
                'unitPrice' => $line->unitPrice->toMoney(),
                'vatRateBp' => $vatApplies ? $line->vatRateBp : 0,
            ];
        }

        return $this->build(new PaperDocument(
            number: null,
            issuedOn: $issuedOn,
            dueOn: $term->dueOn($issuedOn),
            periodStart: $data->periodStart === null ? null : CarbonImmutable::parse($data->periodStart),
            periodEnd: $data->periodEnd === null ? null : CarbonImmutable::parse($data->periodEnd),
            title: $data->title,
            description: $data->description,
            operationCategory: $settings->operation_category,
            seller: DocumentParties::seller($settings, $data->showIban, $data->showEmail),
            buyer: DocumentParties::buyer($client),
            lines: $lines,
            currency: $settings->currency->value,
            term: $term,
            latePenaltyRateBp: $data->latePenaltyRateBp,
            showIban: $data->showIban,
            vatOnDebits: $vatApplies && $settings->vat_on_debits,
            customMentions: $data->customMentions,
            hasLogo: $user->hasMedia('company_logo'),
        ), new DocumentFormatter($data->language, $settings->date_format), 'draft');
    }

    private function build(PaperDocument $document, DocumentFormatter $format, ?string $stamp): InvoicePaperData
    {
        $totals = DocumentTotals::of(array_map(static fn (array $line): array => [
            'quantityMilli' => $line['quantityMilli'],
            'unitPrice' => $line['unitPrice'],
            'vatRateBp' => $line['vatRateBp'],
        ], $document->lines), $document->currency);
        $vatExempt = $document->seller['vatExempt'];

        return new InvoicePaperData(
            language: $format->language,
            labelSeparator: $this->text($format, 'label_separator'),
            title: $this->text($format, 'invoice').($document->number === null ? '' : ' '.$this->text($format, 'number', ['number' => $document->number])),
            stamp: $stamp === null ? null : $this->text($format, $stamp),
            hasLogo: $document->hasLogo,
            meta: [
                new PaperRowData($this->text($format, 'issued_on'), $format->date($document->issuedOn)),
                new PaperRowData($this->text($format, 'due_on'), $format->date($document->dueOn)),
                new PaperRowData($this->text($format, 'service'), $this->serviceLabel($document, $format)),
                new PaperRowData($this->text($format, 'category'), $this->text($format, 'categories.'.$this->categoryKey($document->operationCategory))),
            ],
            seller: new PaperPartyData(
                name: trim($document->seller['name'].' '.($document->seller['legalMention'] ?? '')),
                lines: $this->partyLines($document->seller, $format, isSeller: true),
            ),
            buyer: new PaperPartyData(
                name: $document->buyer['name'],
                lines: $this->partyLines($document->buyer, $format, isSeller: false, showVat: ! $vatExempt),
            ),
            documentTitle: blank($document->title) ? null : $document->title,
            description: blank($document->description) ? null : $document->description,
            head: new PaperLineHeadData(
                description: $this->text($format, 'head.description'),
                quantity: $this->text($format, 'head.quantity'),
                unitPrice: $this->text($format, 'head.unit_price'),
                vat: $this->text($format, 'head.vat'),
                total: $this->text($format, 'head.total'),
            ),
            lines: array_map(static fn (array $line, int $index): PaperLineData => new PaperLineData(
                label: $line['label'],
                detail: blank($line['detail']) ? null : $line['detail'],
                quantity: $format->quantity($line['quantityMilli'], $line['unit']),
                unitPrice: $format->money($line['unitPrice']),
                vat: $format->rate($line['vatRateBp']),
                total: $format->money($totals->lineTotals[$index]),
            ), $document->lines, array_keys($document->lines)),
            noLinesLabel: $this->text($format, 'no_lines'),
            vatHead: new PaperVatHeadData(base: $this->text($format, 'vat_table.base'), rate: $this->text($format, 'vat_table.rate'), amount: $this->text($format, 'vat_table.amount')),
            vatRows: array_map(static fn (array $row): PaperVatRowData => new PaperVatRowData(
                base: $format->money($row['base']),
                rate: $format->rate($row['rateBp']),
                amount: $format->money($row['vat']),
            ), $totals->vatBreakdown),
            totals: [
                new PaperTotalData($this->text($format, 'totals.ht'), $format->money($totals->ht), emphasis: false),
                new PaperTotalData($this->text($format, 'totals.vat'), $format->money($totals->vat), emphasis: false),
                new PaperTotalData($this->text($format, 'totals.ttc'), $format->money($totals->ttc), emphasis: true),
            ],
            paymentTitle: $document->showIban && $document->seller['iban'] !== null ? $this->text($format, 'payment.title') : null,
            payment: $document->showIban && $document->seller['iban'] !== null ? [
                new PaperRowData('IBAN', $this->groupedIban($document->seller['iban'])),
                ...($document->seller['bic'] === null ? [] : [new PaperRowData('BIC', $document->seller['bic'])]),
                new PaperRowData($this->text($format, 'payment.reference'), $document->number ?? $this->text($format, 'payment.reference_later')),
            ] : [],
            legal: $this->legal($document, $format, $vatExempt),
            footer: $document->number ?? $this->text($format, 'invoice'),
        );
    }

    private function serviceLabel(PaperDocument $document, DocumentFormatter $format): string
    {
        if ($document->periodStart instanceof CarbonImmutable && $document->periodEnd instanceof CarbonImmutable) {
            return $document->periodStart->equalTo($document->periodEnd)
                ? $format->date($document->periodStart)
                : $this->text($format, 'period', ['start' => $format->date($document->periodStart), 'end' => $format->date($document->periodEnd)]);
        }

        return blank($document->title) ? '—' : $document->title;
    }

    private function categoryKey(OperationCategory $category): string
    {
        return match ($category) {
            OperationCategory::Services => 'services',
            OperationCategory::Goods => 'goods',
            OperationCategory::Mixed => 'mixed',
        };
    }

    /**
     * @param  Party  $party
     * @return list<string>
     */
    private function partyLines(array $party, DocumentFormatter $format, bool $isSeller, bool $showVat = true): array
    {
        $lines = $party['addressLines'];

        if ($isSeller && $party['siret'] !== null) {
            $lines[] = $this->text($format, 'siret', ['siret' => $this->groupedSiret($party['siret'])]);
        }

        if (! $isSeller && $party['siren'] !== null) {
            $lines[] = $this->text($format, 'siren', ['siren' => trim(chunk_split($party['siren'], 3, ' '))]);
        }

        if ($party['tradeRegistry'] !== null) {
            $lines[] = $this->text($format, 'trade_registry', ['registry' => $party['tradeRegistry']]);
        }

        if ($showVat && $party['vatNumber'] !== null) {
            $lines[] = $this->text($format, 'vat_number', ['number' => $party['vatNumber']]);
        }

        if ($party['email'] !== null) {
            $lines[] = $party['email'];
        }

        return $lines;
    }

    private function legal(PaperDocument $document, DocumentFormatter $format, bool $vatExempt): string
    {
        $due = $format->date($document->dueOn);
        $term = $document->term;
        $sentences = [match (true) {
            $term->days === 0 && ! $term->endOfMonth => $this->text($format, 'legal.on_receipt'),
            $term->days === 0 => $this->text($format, 'legal.end_of_month', ['due' => $due]),
            $term->endOfMonth => $this->text($format, 'legal.term_end_of_month', ['days' => (string) $term->days, 'due' => $due]),
            default => $this->text($format, 'legal.term', ['days' => (string) $term->days, 'due' => $due]),
        }];
        $sentences[] = $document->latePenaltyRateBp === null
            ? $this->text($format, 'legal.penalties_statutory')
            : $this->text($format, 'legal.penalties', ['rate' => rtrim($format->rate($document->latePenaltyRateBp), ' %')]);

        if ($vatExempt) {
            $sentences[] = $this->text($format, 'legal.franchise');
        }

        if ($document->vatOnDebits) {
            $sentences[] = $this->text($format, 'legal.debits');
        }

        if (! blank($document->customMentions)) {
            $sentences[] = trim($document->customMentions);
        }

        return implode(' ', $sentences);
    }

    /**
     * @param  array<string, string>  $replace
     */
    private function text(DocumentFormatter $format, string $key, array $replace = []): string
    {
        return (string) __("invoice_document.{$key}", $replace, $format->locale());
    }

    private function groupedSiret(string $siret): string
    {
        $digits = (string) preg_replace('/\D/', '', $siret);

        return strlen($digits) === 14
            ? substr($digits, 0, 3).' '.substr($digits, 3, 3).' '.substr($digits, 6, 3).' '.substr($digits, 9)
            : $siret;
    }

    private function groupedIban(string $iban): string
    {
        return trim(chunk_split($iban, 4, ' '));
    }
}
