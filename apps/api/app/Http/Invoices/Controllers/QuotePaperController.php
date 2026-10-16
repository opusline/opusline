<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\BuildQuotePaper;
use App\Domain\Invoices\Actions\RenderQuotePdf;
use App\Domain\Invoices\Data\InvoicePaperData;
use App\Domain\Invoices\Data\InvoicePaperQueryData;
use App\Domain\Invoices\Data\SaveQuoteDraftData;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;

/** The printed sheet of a quote: as data for the preview, or as the PDF. */
class QuotePaperController extends Controller
{
    public function show(Quote $quote, InvoicePaperQueryData $query, BuildQuotePaper $buildQuotePaper): InvoicePaperData
    {
        return $buildQuotePaper->forQuote($this->written($quote), $this->language($quote, $query));
    }

    /** The live preview of an editor draft that was never saved. */
    public function preview(SaveQuoteDraftData $data, #[CurrentUser] User $user, BuildQuotePaper $buildQuotePaper): JsonResponse
    {
        return response()->json($buildQuotePaper->forDraft($user, $data));
    }

    public function pdf(Quote $quote, InvoicePaperQueryData $query, RenderQuotePdf $renderQuotePdf): Response|StreamedResponse
    {
        $archived = $quote->status->isIssued() ? $quote->attachedDocument() : null;

        // Validating filed the copy the client got; a later change of logo or
        // settings must not alter what the same number downloads as.
        if ($archived instanceof Media && Storage::disk($archived->disk)->exists($archived->getPathRelativeToRoot())) {
            return Storage::disk($archived->disk)->download($archived->getPathRelativeToRoot(), $archived->file_name, [
                'Cache-Control' => 'no-store',
            ]);
        }

        $language = $this->language($this->written($quote), $query);

        return response($renderQuotePdf->handle($quote, $language), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => sprintf('attachment; filename="%s"', $renderQuotePdf->fileName($quote, $language)),
            'Cache-Control' => 'no-store',
        ]);
    }

    /** A quote recorded from another tool has no sheet here: its document is the PDF that tool produced. */
    private function written(Quote $quote): Quote
    {
        abort_if(! $quote->isWrittenInOpusline(), 404);

        return $quote;
    }

    private function language(Quote $quote, InvoicePaperQueryData $query): DocumentLanguage
    {
        return $query->language ?? $quote->language ?? DocumentLanguage::French;
    }
}
