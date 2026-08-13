<?php

declare(strict_types=1);

namespace App\Domain\Cra\Actions;

use App\Domain\Cra\Models\Cra;

/**
 * Drop a draft, putting the month back on the "à produire" pile. Only a draft: a CRA
 * the client holds is a record, not a scratch pad.
 */
class DeleteCra
{
    public function __construct(
        private readonly LockCra $lockCra,
        private readonly ValidateCra $validateCra,
    ) {}

    public function handle(Cra $cra): void
    {
        $this->lockCra->handle($cra, function (Cra $locked): void {
            $this->validateCra->handleEdit($locked);

            $locked->delete();
        });
    }
}
