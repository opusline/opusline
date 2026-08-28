<?php

declare(strict_types=1);

use Illuminate\Support\Facades\DB;

arch()->preset()->php();

arch('the domain layer is independent of the http delivery layer')
    ->expect('App\Domain')
    ->not->toUse('App\Http');

arch('the http layer reaches the database only through domain actions')
    ->expect('App\Http')
    ->not->toUse(DB::class);

arch('all application code declares strict types')
    ->expect('App')
    ->toUseStrictTypes();
