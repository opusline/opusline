<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Models\CreditNote;

/** A credit note as a PDF, from the same sheet the screen shows. */
class RenderCreditNotePdf
{
    public function __construct(
        private readonly BuildCreditNotePaper $buildCreditNotePaper,
        private readonly RenderPaperPdf $renderPaperPdf,
    ) {}

    public function handle(CreditNote $creditNote, DocumentLanguage $language): string
    {
        return $this->renderPaperPdf->render($this->buildCreditNotePaper->forCreditNote($creditNote, $language), $language, $creditNote->user);
    }

    /** « Avoir-A-2026-001.pdf ». */
    public function fileName(CreditNote $creditNote, DocumentLanguage $language): string
    {
        return sprintf(
            '%s-%s.pdf',
            $language === DocumentLanguage::English ? 'Credit-note' : 'Avoir',
            preg_replace('/[^A-Za-z0-9._-]+/', '-', $creditNote->number),
        );
    }
}
