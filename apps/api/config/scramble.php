<?php

declare(strict_types=1);

use App\OpenApi\SpatieDataToSchema;

return [
    'extensions' => [
        SpatieDataToSchema::class,
    ],

    'renderers' => [
        'elements' => [
            'view' => 'scramble-docs',
            'theme' => 'dark',
            'hideTryIt' => false,
            'hideSchemas' => false,
            'logo' => '/logo.svg',
            'tryItCredentialsPolicy' => 'include',
            'layout' => 'responsive',
            'router' => 'hash',
        ],
    ],
];
