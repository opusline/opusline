<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Settings\Data\UploadCompanyLogoData;
use App\Domain\Users\Models\User;

class UploadCompanyLogo
{
    public function handle(User $user, UploadCompanyLogoData $data): void
    {
        $user->addMedia($data->logo)->toMediaCollection('company_logo');
    }
}
