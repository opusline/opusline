<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Documents;

use App\Domain\Invoices\Data\InvoicePaperData;
use App\Domain\Invoices\Data\PaperLineData;
use App\Domain\Invoices\Data\PaperLineHeadData;
use App\Domain\Invoices\Data\PaperPartyData;
use App\Domain\Invoices\Data\PaperRowData;
use App\Domain\Invoices\Data\PaperSignatureData;
use App\Domain\Invoices\Data\PaperTotalData;
use App\Domain\Invoices\Data\PaperVatHeadData;
use App\Domain\Invoices\Data\PaperVatRowData;
use App\Domain\Invoices\Enums\DocumentKind;
use App\Domain\Invoices\Enums\OperationCategory;
use App\Domain\Shared\Money\Rate;
use Carbon\CarbonImmutable;

/**
 * Resolves a PaperDocument into its printed sheet: every label, amount and
 * mention in the document's language. An invoice and a quote share the
 * layout; the kind decides the meta rows, the legal paragraph and whether
 * the sheet ends with a signature box.
 *
 * @phpstan-import-type Party from DocumentParties
 */
final class PaperBuilder
{
    public function build(PaperDocument $document, DocumentFormatter $format, ?string $stamp): InvoicePaperData
    {
        $totals = DocumentTotals::of(array_map(static fn (array $line): array => [
            'quantityMilli' => $line['quantityMilli'],
            'unitPrice' => $line['unitPrice'],
            'vatRateBp' => $line['vatRateBp'],
        ], $document->lines), $document->currency);
        $vatExempt = $document->seller['vatExempt'];
        $kindLabel = $this->text($format, $document->kind === DocumentKind::Quote ? 'quote' : 'invoice');
        $showPayment = $document->kind === DocumentKind::Invoice && $document->showIban && $document->seller['iban'] !== null;

        return new InvoicePaperData(
            language: $format->language,
            labelSeparator: $this->text($format, 'label_separator'),
            title: $kindLabel.($document->number === null ? '' : ' '.$this->text($format, 'number', ['number' => $document->number])),
            stamp: $stamp === null ? null : $this->text($format, $stamp),
            hasLogo: $document->hasLogo,
            meta: $this->meta($document, $format),
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
            totals: $this->totals($document, $format, $totals),
            paymentTitle: $showPayment ? $this->text($format, 'payment.title') : null,
            payment: $showPayment ? [
                new PaperRowData('IBAN', $this->groupedIban((string) $document->seller['iban'])),
                ...($document->seller['bic'] === null ? [] : [new PaperRowData('BIC', $document->seller['bic'])]),
                new PaperRowData($this->text($format, 'payment.reference'), $document->number ?? $this->text($format, 'payment.reference_later')),
            ] : [],
            legal: $document->kind === DocumentKind::Quote
                ? $this->quoteLegal($document, $format, $vatExempt)
                : $this->invoiceLegal($document, $format, $vatExempt),
            signature: $document->kind === DocumentKind::Quote
                ? new PaperSignatureData($this->text($format, 'signature.title'), $this->text($format, 'signature.caption'))
                : null,
            footer: $document->number ?? $kindLabel,
        );
    }

    /**
     * @return list<PaperRowData>
     */
    private function meta(PaperDocument $document, DocumentFormatter $format): array
    {
        $rows = [new PaperRowData($this->text($format, 'issued_on'), $format->date($document->issuedOn))];

        if ($document->kind === DocumentKind::Quote) {
            $rows[] = new PaperRowData($this->text($format, 'valid_until'), $format->date($document->validUntil ?? $document->issuedOn));
            $rows[] = new PaperRowData($this->text($format, 'service'), $this->serviceLabel($document, $format));

            return $rows;
        }

        $rows[] = new PaperRowData($this->text($format, 'due_on'), $format->date($document->dueOn ?? $document->issuedOn));
        $rows[] = new PaperRowData($this->text($format, 'service'), $this->serviceLabel($document, $format));
        $rows[] = new PaperRowData($this->text($format, 'category'), $this->text($format, 'categories.'.$this->categoryKey($document->operationCategory)));

        return $rows;
    }

    /**
     * @return list<PaperTotalData>
     */
    private function totals(PaperDocument $document, DocumentFormatter $format, DocumentTotals $totals): array
    {
        $rows = [
            new PaperTotalData($this->text($format, 'totals.ht'), $format->money($totals->ht), emphasis: false),
            new PaperTotalData($this->text($format, 'totals.vat'), $format->money($totals->vat), emphasis: false),
            new PaperTotalData($this->text($format, 'totals.ttc'), $format->money($totals->ttc), emphasis: true),
        ];

        if ($document->kind === DocumentKind::Quote && $document->depositRateBp !== null) {
            $rows[] = new PaperTotalData(
                $this->text($format, 'totals.deposit', ['rate' => $this->plainRate($format, $document->depositRateBp)]),
                $format->money(Rate::of($totals->ttc, $document->depositRateBp)),
                emphasis: false,
            );
        }

        return $rows;
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

    private function invoiceLegal(PaperDocument $document, DocumentFormatter $format, bool $vatExempt): string
    {
        $due = $format->date($document->dueOn ?? $document->issuedOn);
        $term = $document->term;
        $sentences = [match (true) {
            $term->days === 0 && ! $term->endOfMonth => $this->text($format, 'legal.on_receipt'),
            $term->days === 0 => $this->text($format, 'legal.end_of_month', ['due' => $due]),
            $term->endOfMonth => $this->text($format, 'legal.term_end_of_month', ['days' => (string) $term->days, 'due' => $due]),
            default => $this->text($format, 'legal.term', ['days' => (string) $term->days, 'due' => $due]),
        }];
        $sentences[] = $document->latePenaltyRateBp === null
            ? $this->text($format, 'legal.penalties_statutory')
            : $this->text($format, 'legal.penalties', ['rate' => $this->plainRate($format, $document->latePenaltyRateBp)]);

        if ($vatExempt) {
            $sentences[] = $this->text($format, 'legal.franchise');
        }

        if ($document->vatOnDebits) {
            $sentences[] = $this->text($format, 'legal.debits');
        }

        if ($document->quoteMention !== null) {
            $sentences[] = $document->quoteMention;
        }

        if (! blank($document->customMentions)) {
            $sentences[] = trim($document->customMentions);
        }

        return implode(' ', $sentences);
    }

    /** What a quote states: how long it stands, what is due on acceptance, and when the invoices will fall due. */
    private function quoteLegal(PaperDocument $document, DocumentFormatter $format, bool $vatExempt): string
    {
        $term = $document->term;
        $sentences = [$this->text($format, 'legal.validity', ['date' => $format->date($document->validUntil ?? $document->issuedOn)])];

        if ($document->depositRateBp !== null) {
            $sentences[] = $this->text($format, 'legal.deposit', ['rate' => $this->plainRate($format, $document->depositRateBp)]);
        }

        $sentences[] = match (true) {
            $term->days === 0 && ! $term->endOfMonth => $this->text($format, 'legal.quote_on_receipt'),
            $term->endOfMonth => $this->text($format, 'legal.quote_term_end_of_month', ['days' => (string) $term->days]),
            default => $this->text($format, 'legal.quote_term', ['days' => (string) $term->days]),
        };

        if ($vatExempt) {
            $sentences[] = $this->text($format, 'legal.franchise');
        }

        if (! blank($document->customMentions)) {
            $sentences[] = trim($document->customMentions);
        }

        return implode(' ', $sentences);
    }

    /** « 12,5 » rather than « 12,5 % »: for sentences that place the sign themselves. */
    private function plainRate(DocumentFormatter $format, int $rateBp): string
    {
        return rtrim($format->rate($rateBp), ' %');
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
