<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Actions;

use App\Domain\TwoFactor\Models\TrustedDevice;

class RevokeTrustedDevice
{
    public function handle(TrustedDevice $device): void
    {
        $device->delete();
    }
}
