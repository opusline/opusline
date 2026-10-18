<?php

declare(strict_types=1);

namespace App\Domain\Features\Enums;

/**
 * A feature still being built, shipped to `main` switched off. Removing a case
 * (and its checks, keeping the code it guarded) is how the feature is released.
 */
enum FeatureFlag: int
{
    /** Writing, issuing and rendering invoices in Opusline (#498). */
    case Invoicing = 0;

    /** The name Pennant stores, the route middleware takes and FEATURE_* spells. */
    public function key(): string
    {
        return match ($this) {
            self::Invoicing => 'invoicing',
        };
    }

    public static function fromKey(string $key): ?self
    {
        foreach (self::cases() as $flag) {
            if ($flag->key() === $key) {
                return $flag;
            }
        }

        return null;
    }
}
