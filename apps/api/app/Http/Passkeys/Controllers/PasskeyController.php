<?php

declare(strict_types=1);

namespace App\Http\Passkeys\Controllers;

use App\Domain\Passkeys\Actions\DeletePasskey;
use App\Domain\Passkeys\Actions\RenamePasskey;
use App\Domain\Passkeys\Actions\StartPasskeyRegistration;
use App\Domain\Passkeys\Actions\StorePasskey;
use App\Domain\Passkeys\Data\PasskeyData;
use App\Domain\Passkeys\Data\PasskeyOptionsData;
use App\Domain\Passkeys\Data\RegisterPasskeyData;
use App\Domain\Passkeys\Data\RenamePasskeyData;
use App\Domain\Passkeys\Models\Passkey;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Passkeys\Support\PasskeyChallenge;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class PasskeyController extends Controller
{
    public function options(#[CurrentUser] User $user, Request $request, StartPasskeyRegistration $startPasskeyRegistration): JsonResponse
    {
        $options = $startPasskeyRegistration->handle($user);

        PasskeyChallenge::put($request->session(), PasskeyChallenge::REGISTRATION, $options);

        return response()->json(new PasskeyOptionsData($options));
    }

    /**
     * @throws ValidationException
     */
    public function store(RegisterPasskeyData $data, #[CurrentUser] User $user, Request $request, StorePasskey $storePasskey): JsonResponse
    {
        $options = PasskeyChallenge::pull($request->session(), PasskeyChallenge::REGISTRATION);

        if ($options === null) {
            throw ValidationException::withMessages(['credential' => __('passkeys.challenge_expired')]);
        }

        $passkey = $storePasskey->handle($user, $data->name, $data->decodedCredential(), $options);

        return response()->json(PasskeyData::fromModel($passkey), 201);
    }

    public function update(RenamePasskeyData $data, Passkey $passkey, RenamePasskey $renamePasskey): JsonResponse
    {
        return response()->json(PasskeyData::fromModel($renamePasskey->handle($passkey, $data->name)));
    }

    public function destroy(Passkey $passkey, DeletePasskey $deletePasskey): Response
    {
        $deletePasskey->handle($passkey);

        return response()->noContent();
    }
}
