<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Settings\Data\UploadSignatureData;
use App\Domain\Users\Models\User;

class UploadSignature
{
    public function handle(User $user, UploadSignatureData $data): void
    {
        $user->addMedia($data->signature)->toMediaCollection('signature');
    }
}
