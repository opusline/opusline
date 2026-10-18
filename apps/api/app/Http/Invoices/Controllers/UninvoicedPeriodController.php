<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\ListUninvoicedPeriods;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

class UninvoicedPeriodController extends Controller
{
    /**
     * The worked periods no invoice covers yet, one per mission (since 0.33.7).
     *
     * Also open to a personal access token carrying `invoices:read`.
     */
    public function index(#[CurrentUser] User $user, ListUninvoicedPeriods $listUninvoicedPeriods): JsonResponse
    {
        return response()->json($listUninvoicedPeriods->handle($user));
    }
}
