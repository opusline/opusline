<?php

declare(strict_types=1);

namespace App\Domain\Users\Actions;

use App\Domain\Users\Enums\SecurityAlertKind;
use App\Domain\Users\Models\User;
use App\Domain\Users\Notifications\SecurityAlert;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ChangeUserPassword
{
    /**
     * Replaces the password and every credential that outlived the old one.
     * Other sessions end on their next request, because Sanctum's
     * AuthenticateSession compares the hash each session was opened with;
     * remember-me cookies and trusted browsers carry no hash, so they are
     * invalidated here.
     */
    public function handle(User $user, #[\SensitiveParameter] string $password): void
    {
        DB::transaction(function () use ($user, $password): void {
            $user->password = $password;
            $user->setRememberToken(Str::random(60));
            $user->save();

            $user->trustedDevices()->delete();
        });

        Log::warning('Password changed.', ['user_id' => $user->id, 'ip' => request()->ip()]);
        $user->notify(SecurityAlert::duringRequest(SecurityAlertKind::PasswordChanged));
    }
}
