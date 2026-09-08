<?php

declare(strict_types=1);

namespace App\Http\TwoFactor\Controllers;

use App\Domain\TwoFactor\Data\TwoFactorStatusData;
use App\Domain\TwoFactor\Models\TrustedDevice;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use App\Http\TwoFactor\Support\TrustedDeviceCookie;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TwoFactorController extends Controller
{
    public function show(#[CurrentUser] User $user, Request $request): JsonResponse
    {
        $token = TrustedDeviceCookie::tokenFrom($request);

        return response()->json(TwoFactorStatusData::fromModel(
            $user,
            currentTokenHash: $token === null ? null : TrustedDevice::hashToken($token),
        ));
    }
}
