<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Seed rates
    |--------------------------------------------------------------------------
    |
    | What a fresh account starts on, before its first read of the official
    | barème. Every consumer reads the stored `user_settings` column — these
    | values are only ever a starting point, never the source of truth.
    |
    | Basis points: 2560 is 25,60 %. Never a float.
    |
    */

    'contribution_rate_bp' => 2560,

    /*
    | mon-entreprise inlines the versement libératoire rates inside its
    | `montant` rule rather than exposing a rate of its own, so the client
    | derives it by evaluating that rule against a known revenue. This seed
    | is the fallback for when the API has never been reached.
    */

    'liberating_payment_rate_bp' => 220,

    /*
    | The revenue used for that derivation. Small enough to stay clear of
    | every ceiling, round enough to divide cleanly.
    */

    'liberating_payment_probe_revenue' => 10_000,

    /*
    | The TVA rate a new invoice defaults to, for an account that is liable
    | for it. An account under the franchise en base defaults to 0 instead —
    | see UserSettings::effectiveVatRateBp(). The rate is snapshotted on each
    | invoice, so crossing the threshold mid-year never rewrites past ones.
    */

    'vat_rate_bp' => 2000,

];
