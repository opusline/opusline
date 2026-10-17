<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\BuildCreditNotePaper;
use App\Domain\Invoices\Actions\ComposeCreditNote;
use App\Domain\Invoices\Actions\IssueCreditNote;
use App\Domain\Invoices\Actions\RefundCreditNote;
use App\Domain\Invoices\Actions\RenderCreditNotePdf;
use App\Domain\Invoices\Data\CreditNoteDetailData;
use App\Domain\Invoices\Data\DeductibleCreditNoteData;
use App\Domain\Invoices\Data\DeductibleCreditNotesData;
use App\Domain\Invoices\Data\InvoicePaperData;
use App\Domain\Invoices\Data\InvoicePaperQueryData;
use App\Domain\Invoices\Data\IssueCreditNoteData;
use App\Domain\Invoices\Data\ListDeductibleCreditNotesData;
use App\Domain\Invoices\Data\RefundCreditNoteData;
use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\CreditNoteStatus;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Models\CreditNote;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Carbon\CarbonImmutable;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CreditNoteController extends Controller
{
    /**
     * The sheet the credit note editor previews, before anything is issued.
     *
     * @throws ValidationException
     * @throws HttpException<409>
     */
    public function preview(IssueCreditNoteData $data, Invoice $invoice, ComposeCreditNote $composeCreditNote, BuildCreditNotePaper $buildCreditNotePaper): JsonResponse
    {
        return response()->json($buildCreditNotePaper->forDraft($invoice, $composeCreditNote->handle($invoice, $data, isPreview: true)));
    }

    /**
     * Issues a credit note on the invoice: numbered, dated today, filed. It cannot be deleted afterwards.
     *
     * @throws ValidationException
     * @throws HttpException<409>
     */
    public function store(IssueCreditNoteData $data, Invoice $invoice, #[CurrentUser] User $user, IssueCreditNote $issueCreditNote): JsonResponse
    {
        $creditNote = $issueCreditNote->handle($user, $invoice, $data);

        return response()->json($this->detail($creditNote), 201);
    }

    /**
     * The refund a credit note owes went back by transfer: recorded as a negative payment of the invoice.
     *
     * @throws ValidationException
     * @throws HttpException<409>
     */
    public function refund(RefundCreditNoteData $data, CreditNote $creditNote, #[CurrentUser] User $user, RefundCreditNote $refundCreditNote): JsonResponse
    {
        $refundCreditNote->handle($user, $creditNote, CarbonImmutable::parse($data->refundedOn), $data->bankMovementId);

        return response()->json($this->detail($creditNote));
    }

    /** The credit notes of a client still waiting to be deducted from one of its invoices: what the editor offers. */
    public function deductible(ListDeductibleCreditNotesData $data, #[CurrentUser] User $user): JsonResponse
    {
        $creditNotes = $user->creditNotes()
            ->where('client_id', $data->clientId)
            ->where('status', CreditNoteStatus::Issued)
            ->where('settlement', CreditNoteSettlement::DeductFromNextInvoice)
            ->where(fn ($query) => $query->whereNull('deduction_invoice_id')->when(
                $data->invoiceId !== null,
                fn ($claimed) => $claimed->orWhere('deduction_invoice_id', $data->invoiceId),
            ))
            ->with(['invoice' => static fn ($invoice) => $invoice->withPaymentFigures()])
            ->orderBy('issued_on')
            ->get();

        return response()->json(new DeductibleCreditNotesData(
            creditNotes: array_values($creditNotes->map(DeductibleCreditNoteData::fromModel(...))->all()),
        ));
    }

    public function show(CreditNote $creditNote): JsonResponse
    {
        return response()->json($this->detail($creditNote));
    }

    public function paper(CreditNote $creditNote, InvoicePaperQueryData $query, BuildCreditNotePaper $buildCreditNotePaper): InvoicePaperData
    {
        return $buildCreditNotePaper->forCreditNote($creditNote, $query->language ?? $creditNote->language);
    }

    /** The legal copy filed when it was issued; rendered again only when that file is gone. */
    public function pdf(CreditNote $creditNote, InvoicePaperQueryData $query, RenderCreditNotePdf $renderCreditNotePdf): Response|StreamedResponse
    {
        $archived = $creditNote->client->media()
            ->where('custom_properties->'.CreditNote::DOCUMENT_CREDIT_NOTE_PROPERTY, $creditNote->id)
            ->first();

        if (! $query->language instanceof DocumentLanguage && $archived instanceof Media && Storage::disk($archived->disk)->exists($archived->getPathRelativeToRoot())) {
            return Storage::disk($archived->disk)->download($archived->getPathRelativeToRoot(), $archived->file_name, [
                'Cache-Control' => 'no-store',
            ]);
        }

        $language = $query->language ?? $creditNote->language;

        return response($renderCreditNotePdf->handle($creditNote, $language), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => sprintf('attachment; filename="%s"', $renderCreditNotePdf->fileName($creditNote, $language)),
            'Cache-Control' => 'no-store',
        ]);
    }

    private function detail(CreditNote $creditNote): CreditNoteDetailData
    {
        $creditNote->load(['lines', 'invoice']);
        $creditNote->invoice->loadMissing('user.settings');

        return CreditNoteDetailData::fromModel($creditNote);
    }
}
