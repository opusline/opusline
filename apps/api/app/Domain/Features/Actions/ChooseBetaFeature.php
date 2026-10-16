<?php

declare(strict_types=1);

namespace App\Domain\Features\Actions;

use App\Domain\Features\Enums\FeatureFlag;
use App\Domain\Features\Enums\FlagRelease;
use App\Domain\Features\FeatureFlags;
use App\Domain\Users\Models\User;
use Laravel\Pennant\Feature;

class ChooseBetaFeature
{
    public function __construct(private readonly FeatureFlags $flags) {}

    public function handle(User $user, FeatureFlag $flag, bool $active): void
    {
        // Forced on or off by the instance: there is nothing for the account to choose.
        abort_if($this->flags->release($flag) !== FlagRelease::Beta, 409, __('features.not_in_beta'));

        if ($active) {
            Feature::for($user)->activate($flag->key());

            return;
        }

        Feature::for($user)->deactivate($flag->key());
    }
}
