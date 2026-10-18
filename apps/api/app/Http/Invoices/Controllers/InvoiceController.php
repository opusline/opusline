<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Documents\Actions\DownloadDocument;
use App\Domain\Invoices\Actions\AttachInvoiceDocument;
use App\Domain\Invoices\Actions\CorrectInvoiceDates;
use App\Domain\Invoices\Actions\CreateInvoice;
use App\Domain\Invoices\Actions\DeleteInvoice;
use App\Domain\Invoices\Actions\DetachInvoiceDocument;
use App\Domain\Invoices\Actions\ListInvoices;
use App\Domain\Invoices\Actions\PayInvoice;
use App\Domain\Invoices\Actions\RemindInvoice;
use App\Domain\Invoices\Actions\RemoveInvoicePayment;
use App\Domain\Invoices\Actions\SendInvoice;
use App\Domain\Invoices\Actions\SuggestInvoiceNumber;
use App\Domain\Invoices\Actions\SummarizeInvoices;
use App\Domain\Invoices\Actions\UpdateInvoice;
use App\Domain\Invoices\Data\CorrectInvoiceDatesData;
use App\Domain\Invoices\Data\CreateInvoiceData;
use App\Domain\Invoices\Data\InvoiceDetailData;
use App\Domain\Invoices\Data\InvoiceListData;
use App\Domain\Invoices\Data\InvoiceListItemData;
use App\Domain\Invoices\Data\ListInvoicesData;
use App\Domain\Invoices\Data\PayInvoiceData;
use App\Domain\Invoices\Data\RemindInvoiceData;
use App\Domain\Invoices\Data\SendInvoiceData;
use App\Domain\Invoices\Data\SummarizeInvoicesData;
use App\Domain\Invoices\Data\UpdateInvoiceData;
use App\Domain\Invoices\Data\UploadInvoiceDocumentData;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Revenue\NetIncome;
use App\Domain\Settings\Rates\ContributionRateHistory;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Carbon\CarbonImmutable;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;

class InvoiceController extends Controller
{
    public function __construct(private readonly ContributionRateHistory $contributionRateHistory) {}

    /** Also open to a personal access token carrying `invoices:read`. */
    public function index(ListInvoicesData $data, #[CurrentUser] User $user, ListInvoices $listInvoices): JsonResponse
    {
        ['invoices' => $invoices, 'nextCursor' => $nextCursor] = $listInvoices->handle($user, $data);
        $netIncome = NetIncome::forAccount($user->settingsOrFail(), $this->contributionRateHistory);

        return response()->json(new InvoiceListData(
            invoices: array_map(
                static fn (Invoice $invoice): InvoiceListItemData => InvoiceListItemData::fromModel($invoice, $netIncome),
                $invoices,
            ),
            // The account-wide grouped SUM rides on the Factures ledger's first
            // page only: deeper pages would recompute a figure the screen
            // already holds, and the fiche tabs slice by client or mission and
            // never read it. Status and date filters keep it — totals must not
            // change meaning per scope chip.
            clientTotals: $data->cursor === null && ! $data->isFicheSlice()
                ? $listInvoices->clientTotals($user)
                : [],
            nextCursor: $nextCursor,
        ));
    }

    public function store(CreateInvoiceData $data, #[CurrentUser] User $user, CreateInvoice $createInvoice): JsonResponse
    {
        $invoice = $createInvoice->handle($user, $data);

        return response()->json($this->detail($invoice), 201);
    }

    /** Also open to a personal access token carrying `invoices:read`. */
    public function show(Invoice $invoice): JsonResponse
    {
        return response()->json($this->detail($invoice));
    }

    public function update(UpdateInvoiceData $data, #[CurrentUser] User $user, Invoice $invoice, UpdateInvoice $updateInvoice): JsonResponse
    {
        $updateInvoice->handle($user, $invoice, $data);

        return response()->json($this->detail($invoice));
    }

    /**
     * @throws HttpException<409>
     */
    public function destroy(Invoice $invoice, DeleteInvoice $deleteInvoice): Response
    {
        $deleteInvoice->handle($invoice);

        return response()->noContent();
    }

    /**
     * @throws HttpException<409>
     */
    public function send(SendInvoiceData $data, Invoice $invoice, SendInvoice $sendInvoice): JsonResponse
    {
        $sendInvoice->handle($invoice, $data);

        return response()->json($this->detail($invoice));
    }

    /**
     * @throws HttpException<409>
     */
    public function pay(PayInvoiceData $data, Invoice $invoice, PayInvoice $payInvoice): JsonResponse
    {
        $payInvoice->handle($invoice, CarbonImmutable::parse($data->paidOn), $data->amount?->toMoney());

        return response()->json($this->detail($invoice));
    }

    /**
     * @throws HttpException<409>
     */
    public function destroyPayment(Invoice $invoice, int $payment, RemoveInvoicePayment $removeInvoicePayment): JsonResponse
    {
        $removeInvoicePayment->handle($invoice, $invoice->payments()->findOrFail($payment));

        return response()->json($this->detail($invoice));
    }

    /**
     * @throws HttpException<409>
     */
    public function remind(RemindInvoiceData $data, Invoice $invoice, RemindInvoice $remindInvoice): JsonResponse
    {
        $remindInvoice->handle($invoice, $data);

        return response()->json($this->detail($invoice), 201);
    }

    /**
     * @throws HttpException<409>
     */
    public function correctDates(CorrectInvoiceDatesData $data, Invoice $invoice, CorrectInvoiceDates $correctInvoiceDates): JsonResponse
    {
        $correctInvoiceDates->handle($invoice, $data);

        return response()->json($this->detail($invoice));
    }

    /**
     * @throws HttpException<409>
     */
    public function storeDocument(UploadInvoiceDocumentData $data, Invoice $invoice, AttachInvoiceDocument $attachInvoiceDocument): JsonResponse
    {
        $attachInvoiceDocument->handle($invoice, $data);

        return response()->json($this->detail($invoice), 201);
    }

    /**
     * @throws HttpException<404>
     */
    public function downloadDocument(Invoice $invoice, DownloadDocument $downloadDocument): StreamedResponse
    {
        $document = $invoice->load('client')->attachedDocument();

        abort_if(! $document instanceof Media, 404);

        return $downloadDocument->handle($document);
    }

    /**
     * @throws HttpException<404>
     */
    public function destroyDocument(Invoice $invoice, DetachInvoiceDocument $detachInvoiceDocument): Response
    {
        $detachInvoiceDocument->handle($invoice);

        return response()->noContent();
    }

    public function summary(SummarizeInvoicesData $data, #[CurrentUser] User $user, SummarizeInvoices $summarizeInvoices): JsonResponse
    {
        return response()->json($summarizeInvoices->handle($user, $data));
    }

    public function nextNumber(#[CurrentUser] User $user, SuggestInvoiceNumber $suggestInvoiceNumber): JsonResponse
    {
        return response()->json($suggestInvoiceNumber->handle($user));
    }

    /**
     * Model::shouldBeStrict() makes a missed eager load throw, and every detail
     * response is built off a model the actions just mutated — so the loading lives
     * here, once, rather than inside the Data class.
     */
    private function detail(Invoice $invoice): InvoiceDetailData
    {
        $invoice->load(['client', 'mission', 'events', 'lines', 'quote', 'emails', 'payments', 'creditNotes', 'deductedCreditNotes', 'user.settings', ...NetIncome::INVOICE_RELATIONS]);

        return InvoiceDetailData::fromModel(
            $invoice,
            NetIncome::forAccount($invoice->user->settingsOrFail(), $this->contributionRateHistory),
        );
    }
}
