<?php

declare(strict_types=1);

namespace App\Domain\Users\Actions;

use App\Domain\Users\Data\UpdateUserEmailData;
use App\Domain\Users\Enums\SecurityAlertKind;
use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\SecurityAlert;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ChangeUserEmail
{
    /**
     * Replaces the address the account signs in with, and the credentials
     * that outlive a sign-in: remember-me cookies and trusted browsers. Other
     * live sessions stay open — Sanctum's AuthenticateSession only ends them
     * when the password hash changes.
     */
    public function handle(User $user, UpdateUserEmailData $data): User
    {
        $previousEmail = $user->email;

        DB::transaction(function () use ($user, $data): void {
            $user->email = $data->email;
            $user->setRememberToken(Str::random(60));
            $user->save();

            $user->trustedDevices()->delete();
        });

        Log::warning('Email changed.', ['user_id' => $user->id, 'ip' => request()->ip()]);
        $user->notify(SecurityAlert::duringRequest(SecurityAlertKind::EmailChanged, recipient: $previousEmail));

        return $user;
    }
}
