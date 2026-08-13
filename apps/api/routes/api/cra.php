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

    Route::post('/cras/{cra}/send', [CraController::class, 'send'])
        ->whereNumber('cra')
        ->name('sendCra');
    Route::post('/cras/{cra}/reopen', [CraController::class, 'reopen'])
        ->whereNumber('cra')
        ->name('reopenCra');
    Route::post('/cras/{cra}/signed-document', [CraController::class, 'storeSignedDocument'])
        ->whereNumber('cra')
        ->middleware('throttle:uploads')
        ->name('uploadSignedCra');

    Route::get('/cras/{cra}/pdf', [CraController::class, 'pdf'])
        ->whereNumber('cra')
        ->name('downloadCraPdf');
});
