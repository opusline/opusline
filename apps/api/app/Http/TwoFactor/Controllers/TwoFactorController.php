<?php

declare(strict_types=1);

namespace App\Http\TwoFactor\Controllers;

use App\Domain\TwoFactor\Data\TwoFactorStatusData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

class TwoFactorController extends Controller
{
    public function show(#[CurrentUser] User $user): JsonResponse
    {
        return response()->json(TwoFactorStatusData::fromModel($user));
    }
}
