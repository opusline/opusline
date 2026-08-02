<?php

declare(strict_types=1);

use App\OpenApi\SpatieDataToSchema;
use Dedoc\Scramble\SecurityDocumentation\MiddlewareAuthSecurityStrategy;
use Dedoc\Scramble\Support\Generator\SecurityScheme;

return [
    'extensions' => [
        SpatieDataToSchema::class,
    ],

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
