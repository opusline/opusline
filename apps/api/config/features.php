<?php

declare(strict_types=1);

/*
 * How far this instance releases each feature still behind a flag
 * (App\Domain\Features\Enums\FeatureFlag): "on" for every account, "off" for
 * none, "beta" for the accounts that opt in from Réglages.
 */
return [
    'invoicing' => env('FEATURE_INVOICING', 'beta'),
];
