<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    | mon-entreprise is the URSSAF-operated simulator behind the official
    | barèmes. Its rules engine is public and unauthenticated. Set `enabled`
    | to false on an air-gapped install: rates then stay on whatever is stored.
    */

    'mon_entreprise' => [
        'url' => env('MON_ENTREPRISE_URL', 'https://mon-entreprise.urssaf.fr/api/v1'),
        'enabled' => filter_var(env('MON_ENTREPRISE_ENABLED', true), FILTER_VALIDATE_BOOLEAN),
        'timeout' => 10,
    ],

    /*
    | The browser app's Sentry project, handed over by GET /api/ping. It lives
    | here rather than in config/sentry.php because that file is passed to the
    | PHP SDK's option resolver as-is, and it rejects keys it does not know.
    */

    'sentry' => [
        'web_dsn' => env('SENTRY_WEB_DSN'),
        'web_traces_sample_rate' => (float) env('SENTRY_WEB_TRACES_SAMPLE_RATE', 1.0),
    ],

];
