<?php

declare(strict_types=1);

namespace App\Http\Passkeys\Controllers;

use App\Domain\Passkeys\Actions\AuthenticatePasskey;
use App\Domain\Passkeys\Actions\StartPasskeyLogin;
use App\Domain\Passkeys\Data\PasskeyLoginData;
use App\Domain\Passkeys\Data\PasskeyOptionsData;
use App\Domain\Users\Data\UserData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Passkeys\Support\PasskeyChallenge;
use App\Http\Users\Support\ThemeCookie;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

/**
 * Passwordless sign-in. A passkey with user verification is both factors
 * at once, so a verified assertion opens the session outright — without the
 * password-confirmation window a typed password would have opened.
 */
class PasskeyLoginController extends Controller
{
    public function options(Request $request, StartPasskeyLogin $startPasskeyLogin): JsonResponse
    {
        $options = $startPasskeyLogin->handle();

        PasskeyChallenge::put($request->session(), PasskeyChallenge::LOGIN, $options);

        return response()->json(new PasskeyOptionsData($options));
    }

    /**
     * @throws ValidationException
     */
    public function store(PasskeyLoginData $data, Request $request, AuthenticatePasskey $authenticatePasskey): JsonResponse
    {
        $options = PasskeyChallenge::pull($request->session(), PasskeyChallenge::LOGIN);

        if ($options === null) {
            throw ValidationException::withMessages(['credential' => __('passkeys.challenge_expired')]);
        }

        $user = $authenticatePasskey->handle($data->decodedCredential(), $options);

        if (! $user instanceof User) {
            throw ValidationException::withMessages(['credential' => __('passkeys.login_failed')]);
        }

        Auth::guard('web')->login($user, $data->remember);
        $request->session()->regenerate();

        return response()->json(UserData::from($user))
            ->withCookie(ThemeCookie::for($user->theme));
    }
}
