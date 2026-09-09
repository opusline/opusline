<?php

declare(strict_types=1);

namespace App\Http\TwoFactor\Controllers;

use App\Domain\Passkeys\Actions\StartPasskeyAssertion;
use App\Domain\Passkeys\Actions\VerifyPasskeyAssertion;
use App\Domain\Passkeys\Data\PasskeyOptionsData;
use App\Domain\Passkeys\Models\Passkey;
use App\Domain\TwoFactor\Actions\ConsumeRecoveryCode;
use App\Domain\TwoFactor\Actions\IssueTrustedDevice;
use App\Domain\TwoFactor\Actions\VerifyTotpCode;
use App\Domain\TwoFactor\Data\TwoFactorChallengeAnswerData;
use App\Domain\Users\Data\UserData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Passkeys\Support\PasskeyChallenge;
use App\Http\TwoFactor\Support\TrustedDeviceCookie;
use App\Http\Users\Support\PendingLogin;
use App\Http\Users\Support\ThemeCookie;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class TwoFactorChallengeController extends Controller
{
    /**
     * Finishes a login whose password was accepted by POST /login.
     *
     * @throws HttpException<409>
     * @throws ValidationException
     */
    public function store(
        TwoFactorChallengeAnswerData $data,
        Request $request,
        VerifyTotpCode $verifyTotpCode,
        ConsumeRecoveryCode $consumeRecoveryCode,
        VerifyPasskeyAssertion $verifyPasskeyAssertion,
        IssueTrustedDevice $issueTrustedDevice,
    ): JsonResponse {
        $session = $request->session();
        $user = PendingLogin::user($session);

        abort_if(! $user instanceof User, 409, __('two-factor.challenge_expired'));

        if ($data->code !== null) {
            $accepted = $verifyTotpCode->handle($user, $data->code);
            $refusal = ['code' => __('two-factor.invalid_code')];
        } elseif (($passkey = $data->decodedPasskey()) !== null) {
            $options = PasskeyChallenge::pull($session, PasskeyChallenge::SECOND_FACTOR);
            $accepted = $options !== null
                && $verifyPasskeyAssertion->handle($passkey, $options, $user->passkeys()->with('user')->get()) instanceof Passkey;
            $refusal = ['passkey' => __('passkeys.verification_failed')];
        } else {
            $accepted = $consumeRecoveryCode->handle($user, $data->recoveryCode ?? '');
            $refusal = ['recoveryCode' => __('two-factor.invalid_recovery_code')];
        }

        if (! $accepted) {
            PendingLogin::recordFailure($session);

            throw ValidationException::withMessages($refusal);
        }

        $remember = PendingLogin::remember($session);
        PendingLogin::clear($session);
        $session->forget(PasskeyChallenge::SECOND_FACTOR);

        Auth::guard('web')->login($user, $remember);
        $session->regenerate();
        $session->passwordConfirmed();

        $response = response()->json(UserData::from($user))
            ->withCookie(ThemeCookie::for($user->theme));

        if ($data->trustDevice) {
            $token = $issueTrustedDevice->handle($user, $request->userAgent(), $request->ip());
            $response->withCookie(TrustedDeviceCookie::for($token));
        }

        return $response;
    }

    /**
     * Assertion options scoped to the pending account's own passkeys.
     *
     * @throws HttpException<409>
     */
    public function passkeyOptions(Request $request, StartPasskeyAssertion $startPasskeyAssertion): JsonResponse
    {
        $session = $request->session();
        $user = PendingLogin::user($session);

        abort_if(! $user instanceof User, 409, __('two-factor.challenge_expired'));

        $options = $startPasskeyAssertion->handle($user);

        PasskeyChallenge::put($session, PasskeyChallenge::SECOND_FACTOR, $options);

        return response()->json(new PasskeyOptionsData($options));
    }
}
