<?php

declare(strict_types=1);

namespace App\Domain\Shared\Anthropic\Actions;

use App\Domain\Users\Models\User;

class DeleteAnthropicApiKey
{
    public function handle(User $user): void
    {
        $user->settingsOrFail()->forceFill(['anthropic_api_key' => null])->save();
    }
}
