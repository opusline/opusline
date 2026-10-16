<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\CreateExternalQuote;
use App\Domain\Invoices\Data\CreateExternalQuoteData;
use App\Domain\Invoices\Data\QuoteDetailData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

/** Quotes issued in another tool and recorded here. */
class ExternalQuoteController extends Controller
{
    public function store(CreateExternalQuoteData $data, #[CurrentUser] User $user, CreateExternalQuote $createExternalQuote): JsonResponse
    {
        $quote = $createExternalQuote->handle($user, $data);

        return response()->json(QuoteDetailData::fromModel($quote->load(['client', 'mission', 'lines', 'invoices'])), 201);
    }
}
