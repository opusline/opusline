<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::pattern('client', '[a-z0-9-]+');

Route::get('/ping', fn () => response()->json([
    'status' => 'ok',
    'version' => config()->string('app.version'),
]));

require __DIR__.'/api/auth.php';
require __DIR__.'/api/clients.php';
require __DIR__.'/api/missions.php';
