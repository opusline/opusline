<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\DescribeUnbilledTime;
use App\Domain\Invoices\Actions\IssueInvoice;
use App\Domain\Invoices\Actions\SaveInvoiceDraft;
use App\Domain\Invoices\Data\InvoiceDetailData;
use App\Domain\Invoices\Data\SaveInvoiceDraftData;
use App\Domain\Invoices\Data\UnbilledTimeData;
use App\Domain\Invoices\Data\UnbilledTimeQueryData;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

/** Invoices written in Opusline: drafted, then issued by validating them. */
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

    public function issue(Invoice $invoice, #[CurrentUser] User $user, IssueInvoice $issueInvoice): JsonResponse
    {
        return response()->json($this->detail($issueInvoice->handle($user, $invoice)));
    }

    /** What « Importer le temps saisi » would add for a mission. */
    public function unbilledTime(UnbilledTimeQueryData $query, #[CurrentUser] User $user, DescribeUnbilledTime $describeUnbilledTime): UnbilledTimeData
    {
        return $describeUnbilledTime->handle($user, $query->missionId, $query->invoiceId);
    }

    private function detail(Invoice $invoice): InvoiceDetailData
    {
        return InvoiceDetailData::fromModel($invoice->load(['client', 'mission', 'events', 'lines', 'quote', 'emails', 'payments', 'creditNotes', 'deductedCreditNotes']));
    }
}
