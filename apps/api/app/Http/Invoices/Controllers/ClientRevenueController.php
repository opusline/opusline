<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\SummarizeClientRevenue;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

class ClientRevenueController extends Controller
{
    public function index(#[CurrentUser] User $user, SummarizeClientRevenue $summarizeClientRevenue): JsonResponse
    {
        return response()->json($summarizeClientRevenue->handle($user));
    }
}
