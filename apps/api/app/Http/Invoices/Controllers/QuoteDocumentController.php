<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\AttachQuoteDocument;
use App\Domain\Invoices\Actions\DetachQuoteDocument;
use App\Domain\Invoices\Data\QuoteDetailData;
use App\Domain\Invoices\Data\UploadInvoiceDocumentData;
use App\Domain\Invoices\Models\Quote;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

/** The PDF of a quote recorded from another tool: filed here, removed here; the quote's pdf route serves it. */
class QuoteDocumentController extends Controller
{
    /**
     * @throws HttpException<409>
     */
    public function store(UploadInvoiceDocumentData $data, Quote $quote, AttachQuoteDocument $attachQuoteDocument): JsonResponse
    {
        $attachQuoteDocument->handle($quote, $data);

        return response()->json(QuoteDetailData::fromModel($quote->load(['client', 'mission', 'lines', 'invoices'])), 201);
    }

    /**
     * @throws HttpException<404>
     */
    public function destroy(Quote $quote, DetachQuoteDocument $detachQuoteDocument): Response
    {
        $detachQuoteDocument->handle($quote);

        return response()->noContent();
    }
}
