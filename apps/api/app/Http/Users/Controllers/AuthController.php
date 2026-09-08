<?php

declare(strict_types=1);

namespace App\Http\Users\Controllers;

use App\Domain\TwoFactor\Actions\RecognizeTrustedDevice;
use App\Domain\TwoFactor\Data\TwoFactorChallengeData;
use App\Domain\TwoFactor\Models\TrustedDevice;
use App\Domain\Users\Actions\MarkReleaseNotesSeen;
use App\Domain\Users\Actions\RegisterUser;
use App\Domain\Users\Actions\UpdateUserTheme;
use App\Domain\Users\Data\ConfirmPasswordData;
use App\Domain\Users\Data\LoginData;
use App\Domain\Users\Data\RegisterUserData;
use App\Domain\Users\Data\UpdateReleaseNotesSeenData;
use App\Domain\Users\Data\UpdateUserThemeData;
use App\Domain\Users\Data\UserData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use App\Http\TwoFactor\Support\TrustedDeviceCookie;
use App\Http\Users\Support\PendingLogin;
use App\Http\Users\Support\ThemeCookie;
use Illuminate\Auth\SessionGuard;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterUserData $data, Request $request, RegisterUser $registerUser): JsonResponse
    {
        $user = $registerUser->handle($data);

        Auth::login($user);
        $request->session()->regenerate();
        $request->session()->passwordConfirmed();

        return response()->json(UserData::from($user), 201)
            ->withCookie(ThemeCookie::for($user->theme));
    }

    /**
     * Signs the user in, or answers 202 with the second-factor challenge when
     * the account has one and this browser is not trusted.
     *
     * @throws ValidationException
     */
    public function login(LoginData $data, Request $request, RecognizeTrustedDevice $recognizeTrustedDevice): JsonResponse
    {
        /** @var SessionGuard $guard */
        $guard = Auth::guard('web');

        if (! $guard->validate(['email' => $data->email, 'password' => $data->password])) {
            if (! User::query()->where('email', $data->email)->exists()) {
                // The guard skips the bcrypt comparison when the email is
                // unknown, so that branch answers measurably faster — a timing
                // oracle for which addresses have accounts. Burn an equivalent
                // hash so both failures cost the same.
                Hash::make($data->password);
            }

            throw ValidationException::withMessages(['email' => __('auth.failed')]);
        }

        $user = $guard->getLastAttempted();

        if (! $user instanceof User) {
            abort(401);
        }

        $isChallenged = $user->hasTwoFactorEnabled()
            && ! $recognizeTrustedDevice->handle($user, TrustedDeviceCookie::tokenFrom($request)) instanceof TrustedDevice;

        if ($isChallenged) {
            PendingLogin::start($request->session(), $user, $data->remember);

            return response()->json(TwoFactorChallengeData::forUser($user), 202);
        }

        $guard->login($user, $data->remember);
        $request->session()->regenerate();
        // A password typed seconds ago is as good as a confirmation: the
        // security settings should not ask for it again right away.
        $request->session()->passwordConfirmed();

        return response()->json(UserData::from($user))
            ->withCookie(ThemeCookie::for($user->theme));
    }

    /**
     * @throws ValidationException
     */
    public function confirmPassword(ConfirmPasswordData $data, Request $request): Response
    {
        $request->session()->passwordConfirmed();

        return response()->noContent();
    }

    public function logout(Request $request): Response
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent()
            ->withCookie(ThemeCookie::forget());
    }

    public function currentUser(#[CurrentUser] User $user): JsonResponse
    {
        return response()->json(UserData::from($user));
    }

    /**
     * @throws ValidationException
     */
    public function updateTheme(UpdateUserThemeData $data, #[CurrentUser] User $user, UpdateUserTheme $updateUserTheme): JsonResponse
    {
        $updateUserTheme->handle($user, $data);

        return response()->json(UserData::from($user))
            ->withCookie(ThemeCookie::for($user->theme));
    }

    public function updateReleaseNotesSeen(UpdateReleaseNotesSeenData $data, #[CurrentUser] User $user, MarkReleaseNotesSeen $markReleaseNotesSeen): JsonResponse
    {
        $user = $markReleaseNotesSeen->handle($user, $data);

        return response()->json(UserData::from($user));
    }
}
