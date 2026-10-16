<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\DeleteQuote;
use App\Domain\Invoices\Actions\ListQuotes;
use App\Domain\Invoices\Data\ListQuotesData;
use App\Domain\Invoices\Data\QuoteDetailData;
use App\Domain\Invoices\Data\QuoteListData;
use App\Domain\Invoices\Data\QuoteListItemData;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

/** The quotes an account wrote: the Devis list, one quote, and the end of a draft. */
class QuoteController extends Controller
{
    public function index(ListQuotesData $data, #[CurrentUser] User $user, ListQuotes $listQuotes): QuoteListData
    {
        return new QuoteListData(array_values(QuoteListItemData::collect($listQuotes->handle($user, $data), 'array')));
    }

    public function show(Quote $quote): JsonResponse
    {
        return response()->json(QuoteDetailData::fromModel($quote->load(['client', 'mission', 'lines', 'invoices'])));
    }

    /**
     * @throws HttpException<409>
     */
    public function destroy(Quote $quote, DeleteQuote $deleteQuote): Response
    {
        $deleteQuote->handle($quote);

        return response()->noContent();
    }
}
