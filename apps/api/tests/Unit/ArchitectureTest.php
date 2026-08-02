<?php

declare(strict_types=1);

arch()->preset()->php();

arch('the domain layer is independent of the http delivery layer')
    ->expect('App\Domain')
    ->not->toUse('App\Http');

arch('all application code declares strict types')
    ->expect('App')
    ->toUseStrictTypes();
