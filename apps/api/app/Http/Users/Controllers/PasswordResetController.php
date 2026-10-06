<?php

declare(strict_types=1);

namespace App\Http\Users\Controllers;

use App\Domain\Users\Actions\ResetForgottenPassword;
use App\Domain\Users\Actions\SendPasswordResetLink;
use App\Domain\Users\Data\RequestPasswordResetData;
use App\Domain\Users\Data\ResetPasswordData;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;

class PasswordResetController extends Controller
{
    /**
     * Answers the same whether or not the address has an account.
     */
    public function store(RequestPasswordResetData $data, SendPasswordResetLink $sendPasswordResetLink): Response
    {
        $sendPasswordResetLink->handle($data);

        return response()->noContent();
    }

    /**
     * @throws ValidationException
     */
    public function update(ResetPasswordData $data, ResetForgottenPassword $resetForgottenPassword): Response
    {
        $resetForgottenPassword->handle($data);

        return response()->noContent();
    }
}
