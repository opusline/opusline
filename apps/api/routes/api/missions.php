<?php

declare(strict_types=1);

use App\Http\Missions\Controllers\MissionController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->scopeBindings()->group(function (): void {
    Route::post('/clients/{client}/missions', [MissionController::class, 'store'])
        ->whereNumber('client')
        ->name('createMission');
    Route::put('/clients/{client}/missions/{mission}', [MissionController::class, 'update'])
        ->whereNumber(['client', 'mission'])
        ->name('updateMission');
    Route::delete('/clients/{client}/missions/{mission}', [MissionController::class, 'destroy'])
        ->whereNumber(['client', 'mission'])
        ->name('deleteMission');
});
