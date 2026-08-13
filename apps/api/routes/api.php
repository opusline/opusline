<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::pattern('client', '[a-z0-9-]+');
Route::pattern('mission', '[a-z0-9-]+');

Route::get('/ping', fn () => response()->json([
    'status' => 'ok',
    'version' => config()->string('app.version'),
]));

require __DIR__.'/api/auth.php';
require __DIR__.'/api/clients.php';
require __DIR__.'/api/invoices.php';
require __DIR__.'/api/missions.php';
require __DIR__.'/api/settings.php';
require __DIR__.'/api/time-entries.php';
require __DIR__.'/api/timers.php';
