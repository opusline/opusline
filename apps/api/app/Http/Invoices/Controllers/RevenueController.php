<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\SummarizeRevenue;
use App\Domain\Invoices\Data\SummarizeRevenueData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

class RevenueController extends Controller
{
    public function show(SummarizeRevenueData $data, #[CurrentUser] User $user, SummarizeRevenue $summarizeRevenue): JsonResponse
    {
        return response()->json($summarizeRevenue->handle($user, $data));
    }
}
