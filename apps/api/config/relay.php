<?php

declare(strict_types=1);

/*
 * Relay mode: the instance the project runs files the reports every other
 * instance sends, through a GitHub App on the repository. Off unless all three
 * GitHub settings are set, so a self-hosted instance never exposes it.
 */
return [
    'github' => [
        'app_id' => env('RELAY_GITHUB_APP_ID'),
        // The App's PEM private key, newlines written as \n in the .env.
        'private_key' => env('RELAY_GITHUB_PRIVATE_KEY'),
        'installation_id' => env('RELAY_GITHUB_INSTALLATION_ID'),
        'repository' => env('RELAY_GITHUB_REPOSITORY', 'opusline/opusline'),
    ],

    // Leading zero bits the sender's SHA-256 must reach: 18 is about 260 000 hashes.
    'difficulty' => (int) env('RELAY_POW_DIFFICULTY', 18),

    'challenge_ttl_seconds' => 600,

    // Instance ids or IP addresses refused outright, comma-separated.
    'blocklist' => array_values(array_filter(array_map(trim(...), explode(',', (string) env('RELAY_BLOCKLIST', ''))))),
];
