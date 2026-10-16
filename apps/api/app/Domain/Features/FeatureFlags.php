<?php

declare(strict_types=1);

namespace App\Domain\Features;

use App\Domain\Features\Enums\FeatureFlag;
use App\Domain\Features\Enums\FlagRelease;
use App\Domain\Users\Models\User;
use Laravel\Pennant\Feature;

/**
 * Whether an account sees a flagged feature. The instance's release wins over
 * the account's choice, so an administrator can force a flag either way;
 * Pennant only stores what an account chose while the flag is in beta.
 */
class FeatureFlags
{
    public function release(FeatureFlag $flag): FlagRelease
    {
        // A mistyped value hides the feature rather than shipping it.
        return FlagRelease::tryFrom(config()->string('features.'.$flag->key(), FlagRelease::Off->value)) ?? FlagRelease::Off;
    }

    public function isActive(User $user, FeatureFlag $flag): bool
    {
        return match ($this->release($flag)) {
            FlagRelease::On => true,
            FlagRelease::Off => false,
            FlagRelease::Beta => Feature::for($user)->active($flag->key()),
        };
    }

    /** @return list<FeatureFlag> */
    public function activeFor(User $user): array
    {
        return $this->where(fn (FeatureFlag $flag): bool => $this->isActive($user, $flag));
    }

    /** @return list<FeatureFlag> */
    public function inBeta(): array
    {
        return $this->where(fn (FeatureFlag $flag): bool => $this->release($flag) === FlagRelease::Beta);
    }

    /**
     * @param  callable(FeatureFlag): bool  $keep
     * @return list<FeatureFlag>
     */
    private function where(callable $keep): array
    {
        $flags = [];

        foreach (FeatureFlag::cases() as $flag) {
            if ($keep($flag)) {
                $flags[] = $flag;
            }
        }

        return $flags;
    }
}
