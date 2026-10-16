<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\DecideQuote;
use App\Domain\Invoices\Actions\IssueQuote;
use App\Domain\Invoices\Actions\ReopenQuote;
use App\Domain\Invoices\Actions\SaveQuoteDraft;
use App\Domain\Invoices\Data\DecideQuoteData;
use App\Domain\Invoices\Data\QuoteDetailData;
use App\Domain\Invoices\Data\SaveQuoteDraftData;
use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Carbon\CarbonImmutable;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;

/** A quote's life: drafted, validated into a sent quote, answered by the client, reopened. */
class QuoteDraftController extends Controller
{
    public function store(SaveQuoteDraftData $data, #[CurrentUser] User $user, SaveQuoteDraft $saveQuoteDraft): JsonResponse
    {
        return response()->json($this->detail($saveQuoteDraft->handle($user, $data)), 201);
    }

    public function update(SaveQuoteDraftData $data, Quote $quote, #[CurrentUser] User $user, SaveQuoteDraft $saveQuoteDraft): QuoteDetailData
    {
        return $this->detail($saveQuoteDraft->handle($user, $data, $quote));
    }

    /**
     * @throws HttpException<409>
     */
    public function issue(Quote $quote, #[CurrentUser] User $user, IssueQuote $issueQuote): JsonResponse
    {
        return response()->json($this->detail($issueQuote->handle($user, $quote)));
    }

    /**
     * @throws HttpException<409>
     */
    public function accept(DecideQuoteData $data, Quote $quote, DecideQuote $decideQuote): JsonResponse
    {
        return response()->json($this->detail($decideQuote->handle($quote, QuoteStatus::Accepted, $this->decidedOn($data))));
    }

    /**
     * @throws HttpException<409>
     */
    public function refuse(DecideQuoteData $data, Quote $quote, DecideQuote $decideQuote): JsonResponse
    {
        return response()->json($this->detail($decideQuote->handle($quote, QuoteStatus::Refused, $this->decidedOn($data))));
    }

    /**
     * @throws HttpException<409>
     */
    public function reopen(Quote $quote, ReopenQuote $reopenQuote): JsonResponse
    {
        return response()->json($this->detail($reopenQuote->handle($quote)));
    }

    private function decidedOn(DecideQuoteData $data): ?CarbonImmutable
    {
        return $data->decidedOn === null ? null : CarbonImmutable::parse($data->decidedOn);
    }

    private function detail(Quote $quote): QuoteDetailData
    {
        return QuoteDetailData::fromModel($quote->load(['client', 'mission', 'lines', 'invoices']));
    }
}
