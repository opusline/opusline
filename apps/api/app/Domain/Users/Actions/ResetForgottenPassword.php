<?php

declare(strict_types=1);

namespace App\Domain\Users\Actions;

use App\Domain\Users\Data\ResetPasswordData;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class ResetForgottenPassword
{
    public function __construct(private readonly ChangeUserPassword $changeUserPassword) {}

    /**
     * Replaces the password of the account the emailed token was issued for.
     * Nobody is signed in by it: the new password still goes through the login,
     * and through the second factor of an account that has one.
     *
     * @throws ValidationException
     */
    public function handle(ResetPasswordData $data): void
    {
        $status = Password::reset(
            ['email' => $data->email, 'token' => $data->token, 'password' => $data->password],
            $this->changeUserPassword->handle(...),
        );

        if ($status !== Password::PASSWORD_RESET) {
            // One answer for an unknown address, a spent token and an expired
            // one: the difference would tell a stranger which accounts exist.
            throw ValidationException::withMessages(['token' => __('passwords.token')]);
        }
    }
}
