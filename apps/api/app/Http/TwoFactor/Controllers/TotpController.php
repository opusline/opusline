<?php

declare(strict_types=1);

namespace App\Http\TwoFactor\Controllers;

use App\Domain\TwoFactor\Actions\ConfirmTotp;
use App\Domain\TwoFactor\Actions\DisableTotp;
use App\Domain\TwoFactor\Actions\StartTotpSetup;
use App\Domain\TwoFactor\Data\ConfirmTotpData;
use App\Domain\TwoFactor\Data\RecoveryCodesData;
use App\Domain\TwoFactor\Data\TotpSetupData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class TotpController extends Controller
{
    /**
     * @throws HttpException<409>
     */
    public function start(#[CurrentUser] User $user, StartTotpSetup $startTotpSetup): JsonResponse
    {
        return response()->json(TotpSetupData::forSecret($startTotpSetup->handle($user), $user->email));
    }

    /**
     * @throws HttpException<409>
     * @throws ValidationException
     */
    public function confirm(ConfirmTotpData $data, #[CurrentUser] User $user, ConfirmTotp $confirmTotp): JsonResponse
    {
        return response()->json(new RecoveryCodesData($confirmTotp->handle($user, $data->code)));
    }

    public function destroy(#[CurrentUser] User $user, DisableTotp $disableTotp): Response
    {
        $disableTotp->handle($user);

        return response()->noContent();
    }
}
