<?php

declare(strict_types=1);

namespace App\Domain\Cra\Actions;

use App\Domain\Cra\Data\UpdateCraDaysData;
use App\Domain\Cra\Models\Cra;
use Carbon\CarbonImmutable;
use Illuminate\Validation\ValidationException;

class UpdateCraDays
{
    public function __construct(
        private readonly LockCra $lockCra,
        private readonly ValidateCra $validateCra,
        private readonly WriteCraDays $writeCraDays,
    ) {}

    public function handle(Cra $cra, UpdateCraDaysData $data): Cra
    {
        $days = [];

        foreach ($data->days as $index => $day) {
            $date = CarbonImmutable::parse($day->date);

            if (! $date->isSameMonth($cra->month)) {
                throw ValidationException::withMessages([
                    "days.{$index}.date" => __('cra.day_outside_month'),
                ]);
            }

            // Rejected rather than collapsed: two values for one day means the caller
            // and the server disagree about the grid, and last-one-wins hides that.
            if (isset($days[$date->toDateString()])) {
                throw ValidationException::withMessages([
                    "days.{$index}.date" => __('cra.day_listed_twice'),
                ]);
            }

            $days[$date->toDateString()] = $day->dayFractionBp;
        }

        return $this->lockCra->handle($cra, function (Cra $locked) use ($days): Cra {
            $this->validateCra->handleEdit($locked);

            return $this->writeCraDays->handle($locked, $days);
        });
    }
}
