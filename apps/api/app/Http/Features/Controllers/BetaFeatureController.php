<?php

declare(strict_types=1);

namespace App\Http\Features\Controllers;

use App\Domain\Features\Actions\ChooseBetaFeature;
use App\Domain\Features\Data\BetaFeatureData;
use App\Domain\Features\Data\BetaFeaturesData;
use App\Domain\Features\Data\ChooseBetaFeatureData;
use App\Domain\Features\Enums\FeatureFlag;
use App\Domain\Features\FeatureFlags;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;

class BetaFeatureController extends Controller
{
    public function index(#[CurrentUser] User $user, FeatureFlags $flags): BetaFeaturesData
    {
        return new BetaFeaturesData(array_map(
            fn (FeatureFlag $flag): BetaFeatureData => new BetaFeatureData(
                feature: $flag,
                key: $flag->key(),
                active: $flags->isActive($user, $flag),
            ),
            $flags->inBeta(),
        ));
    }

    public function update(
        #[CurrentUser] User $user,
        string $feature,
        ChooseBetaFeatureData $data,
        ChooseBetaFeature $chooseBetaFeature,
        FeatureFlags $flags,
    ): BetaFeaturesData {
        $flag = FeatureFlag::fromKey($feature);
        abort_if(! $flag instanceof FeatureFlag, 404);

        $chooseBetaFeature->handle($user, $flag, $data->active);

        return $this->index($user, $flags);
    }
}
