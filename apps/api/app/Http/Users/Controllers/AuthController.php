<?php

declare(strict_types=1);

namespace App\Http\Users\Controllers;

use App\Domain\Users\Actions\RegisterUser;
use App\Domain\Users\Data\LoginData;
use App\Domain\Users\Data\RegisterUserData;
use App\Domain\Users\Data\UserData;
use App\Http\Controllers\Controller;
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

        return response()->json(UserData::from($user), 201);
    }

    public function login(LoginData $data, Request $request): JsonResponse
    {
        if (! Auth::attempt(['email' => $data->email, 'password' => $data->password])) {
            throw ValidationException::withMessages(['email' => __('auth.failed')]);
        }

        $request->session()->regenerate();

        return response()->json(UserData::from($request->user() ?? abort(401)));
    }

    public function logout(Request $request): Response
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }

    public function currentUser(Request $request): JsonResponse
    {
        return response()->json(UserData::from($request->user() ?? abort(401)));
    }
}
