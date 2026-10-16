<?php

declare(strict_types=1);

namespace App\Http\Expenses\Controllers;

use App\Domain\EInvoicing\Actions\SyncReceivedEInvoices;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

/** « Synchroniser » on the Dépenses page: reads the platform's inbox now rather than tonight. */
class EInvoiceSyncController extends Controller
{
    public function __invoke(#[CurrentUser] User $user, SyncReceivedEInvoices $syncReceivedEInvoices): JsonResponse
    {
        return response()->json($syncReceivedEInvoices->handle($user));
    }
}
