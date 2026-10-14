<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\BuildInvoicePaper;
use App\Domain\Invoices\Actions\RenderInvoicePdf;
use App\Domain\Invoices\Data\InvoicePaperData;
use App\Domain\Invoices\Data\InvoicePaperQueryData;
use App\Domain\Invoices\Data\SaveInvoiceDraftData;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/** The printed sheet of an invoice written in Opusline: as data for the preview, or as the PDF. */
class InvoicePaperController extends Controller
{
    public function show(Invoice $invoice, InvoicePaperQueryData $query, BuildInvoicePaper $buildInvoicePaper): InvoicePaperData
    {
        return $buildInvoicePaper->forInvoice($this->written($invoice), $this->language($invoice, $query));
    }

    /** The live preview of an editor draft that was never saved. */
    public function preview(SaveInvoiceDraftData $data, #[CurrentUser] User $user, BuildInvoicePaper $buildInvoicePaper): JsonResponse
    {
        return response()->json($buildInvoicePaper->forDraft($user, $data));
    }

    public function pdf(Invoice $invoice, InvoicePaperQueryData $query, RenderInvoicePdf $renderInvoicePdf): Response
    {
        $language = $this->language($this->written($invoice), $query);

        return response($renderInvoicePdf->handle($invoice, $language), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => sprintf('attachment; filename="%s"', $renderInvoicePdf->fileName($invoice, $language)),
            'Cache-Control' => 'no-store',
        ]);
    }

    /** An invoice recorded from another tool has no sheet here: its document is the PDF that tool produced. */
    private function written(Invoice $invoice): Invoice
    {
        abort_if(! $invoice->isWrittenInOpusline(), 404);

        return $invoice;
    }

    private function language(Invoice $invoice, InvoicePaperQueryData $query): DocumentLanguage
    {
        return $query->language ?? $invoice->language ?? DocumentLanguage::French;
    }
}
