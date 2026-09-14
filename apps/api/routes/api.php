<?php

declare(strict_types=1);

use App\Domain\Health\Data\PingData;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;

Route::pattern('client', '[a-z0-9-]+');
Route::pattern('mission', '[a-z0-9-]+');

Route::get('/ping', fn (): JsonResponse => response()->json(PingData::fromConfig()));

require __DIR__.'/api/auth.php';
require __DIR__.'/api/bank.php';
require __DIR__.'/api/clients.php';
require __DIR__.'/api/cra.php';
require __DIR__.'/api/deadlines.php';
require __DIR__.'/api/declarations.php';
require __DIR__.'/api/documents.php';
require __DIR__.'/api/expenses.php';
require __DIR__.'/api/invoices.php';
require __DIR__.'/api/missions.php';
require __DIR__.'/api/passkeys.php';
require __DIR__.'/api/revenue.php';
require __DIR__.'/api/settings.php';
require __DIR__.'/api/time-entries.php';
require __DIR__.'/api/timers.php';
require __DIR__.'/api/treasury.php';
require __DIR__.'/api/two-factor.php';
