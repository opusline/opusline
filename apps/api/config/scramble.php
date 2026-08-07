<?php

declare(strict_types=1);

use App\OpenApi\SpatieDataToSchema;
use Dedoc\Scramble\SecurityDocumentation\MiddlewareAuthSecurityStrategy;
use Dedoc\Scramble\Support\Generator\SecurityScheme;

return [
    'info' => [
        'version' => '0.3.0', // x-release-please-version
    ],

    'extensions' => [
        SpatieDataToSchema::class,
    ],

    'enum_cases_names_strategy' => 'varnames',

    'security_strategy' => [
        MiddlewareAuthSecurityStrategy::class,
        [
            'middleware' => ['auth', 'auth:*'],
            'scheme' => SecurityScheme::apiKey('cookie', 'opusline-session'),
        ],
    ],

    'renderers' => [
        'elements' => [
            'view' => 'scramble-docs',
            'theme' => 'dark',
            'hideTryIt' => false,
            'hideSchemas' => true,
            'logo' => '/logo.svg',
            'tryItCredentialsPolicy' => 'include',
            'layout' => 'responsive',
            'router' => 'hash',
        ],
    ],
];
