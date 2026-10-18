<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\InvoiceQuote;
use App\Domain\Invoices\Data\InvoiceDetailData;
use App\Domain\Invoices\Data\InvoiceQuoteData;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Invoices\Revenue\NetIncome;
use App\Domain\Settings\Rates\ContributionRateHistory;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;

/** The invoices an accepted quote turns into. */
class QuoteInvoiceController extends Controller
{
    public function __construct(private readonly ContributionRateHistory $contributionRateHistory) {}

    /**
     * @throws HttpException<409>
     */
    public function store(InvoiceQuoteData $data, Quote $quote, #[CurrentUser] User $user, InvoiceQuote $invoiceQuote): JsonResponse
    {
        $invoice = $invoiceQuote->handle($user, $quote, $data->billing);

        $invoice->load(['client', 'mission', 'events', 'lines', 'quote', 'emails', 'payments', 'creditNotes', 'deductedCreditNotes', ...NetIncome::INVOICE_RELATIONS]);

        return response()->json(InvoiceDetailData::fromModel(
            $invoice,
            NetIncome::forAccount($user->settingsOrFail(), $this->contributionRateHistory),
        ), 201);
    }
}
