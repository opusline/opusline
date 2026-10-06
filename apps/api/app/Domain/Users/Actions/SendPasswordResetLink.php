<?php

declare(strict_types=1);

namespace App\Domain\Users\Actions;

use App\Domain\Users\Data\RequestPasswordResetData;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class SendPasswordResetLink
{
    /**
     * Emails a reset link when the address belongs to an account, and says
     * nothing either way: the caller is a stranger, and which addresses have
     * accounts is not theirs to learn.
     */
    public function handle(RequestPasswordResetData $data): void
    {
        $status = Password::sendResetLink(['email' => $data->email]);

        if ($status !== Password::RESET_LINK_SENT) {
            // The broker hashes the token it stores, so only the request that
            // found an account pays for a hash — the same timing oracle as
            // login's. Burn one here so both answers cost the same.
            Hash::make($data->email);
        }
    }
}
