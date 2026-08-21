<?php

declare(strict_types=1);

namespace App\Domain\Bank\Actions;

use App\Domain\Bank\Models\PersonalTransfer;

class DeletePersonalTransfer
{
    public function handle(PersonalTransfer $transfer): void
    {
        $transfer->delete();
    }
}
