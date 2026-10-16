<?php

declare(strict_types=1);

namespace App\Domain\Features\Enums;

/** How far an instance has released a flag, as FEATURE_<NAME> sets it. */
enum FlagRelease: string
{
    /** On for every account, whatever it chose. */
    case On = 'on';

    /** Off for every account, opted in or not. */
    case Off = 'off';

    /** Off unless the account opted in, from Réglages. */
    case Beta = 'beta';
}
