<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\SaveInvoiceDraft;
use App\Domain\Invoices\Data\InvoiceDetailData;
use App\Domain\Invoices\Data\SaveInvoiceDraftData;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

/** Drafts written in Opusline; issuing one is a separate step (validation). */
class InvoiceDraftController extends Controller
{
    public function store(SaveInvoiceDraftData $data, #[CurrentUser] User $user, SaveInvoiceDraft $saveInvoiceDraft): JsonResponse
    {
        $invoice = $saveInvoiceDraft->handle($user, $data);

        return response()->json($this->detail($invoice), 201);
    }

    public function update(SaveInvoiceDraftData $data, Invoice $invoice, #[CurrentUser] User $user, SaveInvoiceDraft $saveInvoiceDraft): InvoiceDetailData
    {
        return $this->detail($saveInvoiceDraft->handle($user, $data, $invoice));
    }

    private function detail(Invoice $invoice): InvoiceDetailData
    {
        return InvoiceDetailData::fromModel($invoice->load(['client', 'mission', 'events', 'lines']));
    }
}
