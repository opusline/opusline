<?php

declare(strict_types=1);

use App\OpenApi\SessionOrTokenSecurity;
use App\OpenApi\SpatieDataToSchema;

return [
    'info' => [
        'version' => '0.33.6', // x-release-please-version
    ],

    'extensions' => [
        SpatieDataToSchema::class,
    ],

    'enum_cases_names_strategy' => 'varnames',

    'security_strategy' => SessionOrTokenSecurity::class,

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
