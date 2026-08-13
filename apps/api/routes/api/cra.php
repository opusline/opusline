<?php

declare(strict_types=1);

use App\Http\Cra\Controllers\CraController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/cras', [CraController::class, 'index'])
        ->name('listCras');
    Route::post('/cras', [CraController::class, 'store'])
        ->name('createCra');

    Route::get('/cras/{cra}', [CraController::class, 'show'])
        ->whereNumber('cra')
        ->name('showCra');
    Route::delete('/cras/{cra}', [CraController::class, 'destroy'])
        ->whereNumber('cra')
        ->name('deleteCra');

    Route::put('/cras/{cra}/days', [CraController::class, 'updateDays'])
        ->whereNumber('cra')
        ->name('updateCraDays');
    Route::post('/cras/{cra}/reset', [CraController::class, 'reset'])
        ->whereNumber('cra')
        ->name('resetCra');
});
