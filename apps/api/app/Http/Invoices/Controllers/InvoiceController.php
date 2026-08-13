<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\CreateInvoice;
use App\Domain\Invoices\Actions\DeleteInvoice;
use App\Domain\Invoices\Actions\ListInvoices;
use App\Domain\Invoices\Actions\PayInvoice;
use App\Domain\Invoices\Actions\RemindInvoice;
use App\Domain\Invoices\Actions\SendInvoice;
use App\Domain\Invoices\Actions\SuggestInvoiceNumber;
use App\Domain\Invoices\Actions\SummarizeInvoices;
use App\Domain\Invoices\Actions\UpdateInvoice;
use App\Domain\Invoices\Data\CreateInvoiceData;
use App\Domain\Invoices\Data\InvoiceDetailData;
use App\Domain\Invoices\Data\InvoiceListData;
use App\Domain\Invoices\Data\InvoiceListItemData;
use App\Domain\Invoices\Data\ListInvoicesData;
use App\Domain\Invoices\Data\PayInvoiceData;
use App\Domain\Invoices\Data\RemindInvoiceData;
use App\Domain\Invoices\Data\SummarizeInvoicesData;
use App\Domain\Invoices\Data\UpdateInvoiceData;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class InvoiceController extends Controller
{
    public function index(ListInvoicesData $data, #[CurrentUser] User $user, ListInvoices $listInvoices): JsonResponse
    {
        $invoices = $listInvoices->handle($user, $data);

        return response()->json(new InvoiceListData(
            invoices: array_values(InvoiceListItemData::collect($invoices, 'array')),
        ));
    }

    public function store(CreateInvoiceData $data, #[CurrentUser] User $user, CreateInvoice $createInvoice): JsonResponse
    {
        $invoice = $createInvoice->handle($user, $data);

        return response()->json($this->detail($invoice), 201);
    }

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
    public function send(Invoice $invoice, SendInvoice $sendInvoice): JsonResponse
    {
        $sendInvoice->handle($invoice);

        return response()->json($this->detail($invoice));
    }

    /**
     * @throws HttpException<409>
     */
    public function pay(PayInvoiceData $data, Invoice $invoice, PayInvoice $payInvoice): JsonResponse
    {
        $payInvoice->handle($invoice, $data);

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
        return InvoiceDetailData::fromModel($invoice->load(['client', 'mission', 'events']));
    }
}
