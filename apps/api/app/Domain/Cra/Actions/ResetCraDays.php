<?php

declare(strict_types=1);

namespace App\Domain\Cra\Actions;

use App\Domain\Cra\Models\Cra;

/**
 * Throw away the manual edits and rebuild the grid from tracked time — "Rétablir mes
 * entrées".
 */
class ResetCraDays
{
    public function __construct(
        private readonly LockCra $lockCra,
        private readonly ValidateCra $validateCra,
        private readonly MaterializeCraDays $materializeCraDays,
        private readonly WriteCraDays $writeCraDays,
    ) {}

    public function handle(Cra $cra): Cra
    {
        return $this->lockCra->handle($cra, function (Cra $locked): Cra {
            $this->validateCra->handleEdit($locked);

            // Loaded explicitly: a route-bound Cra arrives with no relations, and a
            // single-row fetch slips past Model::shouldBeStrict() rather than reporting
            // the lazy load.
            $locked->loadMissing('mission');

            return $this->writeCraDays->handle(
                $locked,
                $this->materializeCraDays->handle($locked->mission, $locked->month),
            );
        });
    }
}
