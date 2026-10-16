<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Models\Invoice;

/** An invoice written in Opusline as a PDF, from the same sheet the screen previews. */
class RenderInvoicePdf
{
    public function __construct(
        private readonly BuildInvoicePaper $buildInvoicePaper,
        private readonly RenderPaperPdf $renderPaperPdf,
    ) {}

    public function handle(Invoice $invoice, DocumentLanguage $language): string
    {
        return $this->renderPaperPdf->render($this->buildInvoicePaper->forInvoice($invoice, $language), $language, $invoice->user);
    }

    /** « Facture-2026-014.pdf », or « Brouillon-facture.pdf » before it is numbered. */
    public function fileName(Invoice $invoice, DocumentLanguage $language): string
    {
        $english = $language === DocumentLanguage::English;

        return $invoice->number === null
            ? ($english ? 'Draft-invoice.pdf' : 'Brouillon-facture.pdf')
            : sprintf('%s-%s.pdf', $english ? 'Invoice' : 'Facture', preg_replace('/[^A-Za-z0-9._-]+/', '-', $invoice->number));
    }
}
