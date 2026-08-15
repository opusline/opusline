<?php

declare(strict_types=1);

namespace App\Http\Users\Controllers;

use App\Domain\Users\Actions\MarkReleaseNotesSeen;
use App\Domain\Users\Actions\RegisterUser;
use App\Domain\Users\Actions\UpdateUserTheme;
use App\Domain\Users\Data\LoginData;
use App\Domain\Users\Data\RegisterUserData;
use App\Domain\Users\Data\UpdateUserThemeData;
use App\Domain\Users\Data\UserData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Users\Support\ThemeCookie;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterUserData $data, Request $request, RegisterUser $registerUser): JsonResponse
    {
        $user = $registerUser->handle($data);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(UserData::from($user), 201)
            ->withCookie(ThemeCookie::for($user->theme));
    }

    public function login(LoginData $data, Request $request): JsonResponse
    {
        if (! Auth::attempt(['email' => $data->email, 'password' => $data->password], $data->remember)) {
            throw ValidationException::withMessages(['email' => __('auth.failed')]);
        }

        $request->session()->regenerate();

        $user = $request->user() ?? abort(401);

        return response()->json(UserData::from($user))
            ->withCookie(ThemeCookie::for($user->theme));
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

    public function updateReleaseNotesSeen(#[CurrentUser] User $user, MarkReleaseNotesSeen $markReleaseNotesSeen): JsonResponse
    {
        $markReleaseNotesSeen->handle($user);

        return response()->json(UserData::from($user));
    }
}
