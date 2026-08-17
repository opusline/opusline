<?php

declare(strict_types=1);

namespace App\Http\Settings\Controllers;

use App\Domain\Settings\Actions\ListFiscalDeadlines;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

class FiscalDeadlineController extends Controller
{
    public function index(#[CurrentUser] User $user, ListFiscalDeadlines $listFiscalDeadlines): JsonResponse
    {
        return response()->json($listFiscalDeadlines->handle($user));
    }
}
