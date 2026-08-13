<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Users\Models\User;

class DeleteSignature
{
    public function handle(User $user): void
    {
        $user->clearMediaCollection('signature');
    }
}
