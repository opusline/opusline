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
        'enabled' => env('MON_ENTREPRISE_ENABLED', true),
        'timeout' => 10,
    ],

];
