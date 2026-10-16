<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Models\Quote;

/** A quote as a PDF, from the same sheet the screen previews. */
class RenderQuotePdf
{
    public function __construct(
        private readonly BuildQuotePaper $buildQuotePaper,
        private readonly RenderPaperPdf $renderPaperPdf,
    ) {}

    public function handle(Quote $quote, DocumentLanguage $language): string
    {
        return $this->renderPaperPdf->render($this->buildQuotePaper->forQuote($quote, $language), $language, $quote->user);
    }

    /** « Devis-D-2026-003.pdf », or « Brouillon-devis.pdf » before it is numbered. */
    public function fileName(Quote $quote, DocumentLanguage $language): string
    {
        $english = $language === DocumentLanguage::English;

        return $quote->number === null
            ? ($english ? 'Draft-quote.pdf' : 'Brouillon-devis.pdf')
            : sprintf('%s-%s.pdf', $english ? 'Quote' : 'Devis', preg_replace('/[^A-Za-z0-9._-]+/', '-', $quote->number));
    }
}
