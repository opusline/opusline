<?php

declare(strict_types=1);

/*
 * The in-app reporter: an account's bug report or feature request goes to the
 * relay (config/relay.php on the project's instance), which files it on
 * GitHub. Nothing is sent until the account presses send.
 */
return [
    // A self-hoster switches the reporter off with OPUSLINE_REPORTS=false.
    'enabled' => (bool) env('OPUSLINE_REPORTS', true),

    // The relay instance's address, e.g. https://relay.example.org. No default
    // until the project's relay is deployed (#630): without one, the reporter
    // answers 404 as if it were switched off.
    'relay_url' => env('OPUSLINE_REPORTS_RELAY_URL'),

    'timeout_seconds' => 10,

    // A relay asking for more is refused rather than left to hold a worker:
    // 24 bits is about 17 million hashes, several seconds of CPU.
    'max_difficulty' => 24,
];
