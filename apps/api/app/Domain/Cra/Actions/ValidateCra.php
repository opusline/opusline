<?php

declare(strict_types=1);

namespace App\Domain\Cra\Actions;

use App\Domain\Cra\Models\Cra;
use App\Domain\Missions\Models\Mission;
use Carbon\CarbonImmutable;
use Illuminate\Validation\ValidationException;

/**
 * The rules a CRA answers to that a Data attribute cannot express on its own.
 */
class ValidateCra
{
    public function handleCreation(Mission $mission, CarbonImmutable $month): void
    {
        if (! $mission->cra_required) {
            throw ValidationException::withMessages([
                'missionId' => __('cra.mission_does_not_require_one'),
            ]);
        }

        if (! $mission->billing_mode->usesDayFraction()) {
            throw ValidationException::withMessages([
                'missionId' => __('cra.mission_is_not_billed_by_the_day'),
            ]);
        }

        // Compared as Y-m strings: the month is a UTC-midnight instant while the
        // account's today lives in its own timezone, and comparing instants across
        // zones misreads the calendar around midnight.
        if ($month->format('Y-m') > $mission->user->settingsOrFail()->today()->format('Y-m')) {
            throw ValidationException::withMessages([
                'month' => __('cra.month_is_in_the_future'),
            ]);
        }

        $exists = $mission->cras()
            ->where('month', $month->startOfMonth()->toDateString())
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'month' => __('cra.already_exists'),
            ]);
        }
    }

    /**
     * A CRA the client already holds keeps reporting the days they received; editing
     * it would rewrite a document that has left the building.
     */
    public function handleEdit(Cra $cra): void
    {
        abort_if(! $cra->isEditable(), 409, __('cra.already_issued'));
    }
}
