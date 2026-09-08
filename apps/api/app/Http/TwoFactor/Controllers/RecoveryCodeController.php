<?php

declare(strict_types=1);

namespace App\Http\TwoFactor\Controllers;

use App\Domain\TwoFactor\Actions\GenerateRecoveryCodes;
use App\Domain\TwoFactor\Data\RecoveryCodesData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;

class RecoveryCodeController extends Controller
{
    /**
     * @throws HttpException<409>
     */
    public function show(#[CurrentUser] User $user): JsonResponse
    {
        abort_if(! $user->hasTotpEnabled(), 409, __('two-factor.not_enabled'));

        return response()->json(new RecoveryCodesData($user->two_factor_recovery_codes ?? []));
    }

    /**
     * @throws HttpException<409>
     */
    public function regenerate(#[CurrentUser] User $user, GenerateRecoveryCodes $generateRecoveryCodes): JsonResponse
    {
        return response()->json(new RecoveryCodesData($generateRecoveryCodes->handle($user)));
    }
}
