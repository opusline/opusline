<?php

declare(strict_types=1);

namespace App\Domain\Cra\Actions;

use App\Domain\Cra\Data\CreateCraData;
use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Cra\Models\Cra;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

/**
 * Open a month's CRA, pre-filled from the time tracked on the mission. The grid is a
 * snapshot from this moment on: editing a past entry later never rewrites a CRA the
 * client already holds.
 */
class CreateCra
{
    public function __construct(
        private readonly ValidateCra $validateCra,
        private readonly MaterializeCraDays $materializeCraDays,
        private readonly WriteCraDays $writeCraDays,
    ) {}

    public function handle(User $user, CreateCraData $data): Cra
    {
        return DB::transaction(function () use ($user, $data): Cra {
            User::lockRow($user->id);

            $mission = $user->missions()->whereKey($data->missionId)->firstOrFail();
            $month = CarbonImmutable::parse($data->month.'-01')->startOfMonth();

            $this->validateCra->handleCreation($mission, $month);

            $cra = $user->cras()->create([
                'mission_id' => $mission->id,
                'month' => $month,
                'status' => CraStatus::Draft,
            ]);

            $cra->setRelation('mission', $mission);

            return $this->writeCraDays->handle($cra, $this->materializeCraDays->handle($mission, $month));
        });
    }
}
