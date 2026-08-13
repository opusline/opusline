<?php

declare(strict_types=1);

namespace App\Domain\Cra\Actions;

use App\Domain\Cra\Models\Cra;

/**
 * Replace a CRA's grid wholesale. The grid is one value the user edits as a whole, so
 * a day disappears by being left out rather than by a separate delete.
 */
class WriteCraDays
{
    /**
     * @param  array<string, int>  $days  `Y-m-d` => basis points of a workday
     */
    public function handle(Cra $cra, array $days): Cra
    {
        $cra->days()->delete();

        $rows = [];

        foreach ($days as $date => $basisPoints) {
            if ($basisPoints <= 0) {
                continue;
            }

            $rows[] = ['cra_id' => $cra->id, 'date' => $date, 'day_fraction_bp' => $basisPoints];
        }

        if ($rows !== []) {
            $cra->days()->insert($rows);
        }

        return $cra->load('days');
    }
}
