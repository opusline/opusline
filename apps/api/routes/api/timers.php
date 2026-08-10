<?php

declare(strict_types=1);

use App\Http\Timers\Controllers\TimerController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/timer', [TimerController::class, 'show'])
        ->name('showTimer');
    Route::post('/timer', [TimerController::class, 'store'])
        ->name('startTimer');
    Route::put('/timer', [TimerController::class, 'update'])
        ->name('updateTimer');
    Route::delete('/timer', [TimerController::class, 'destroy'])
        ->name('discardTimer');
    Route::post('/timer/pause', [TimerController::class, 'pause'])
        ->name('pauseTimer');
    Route::post('/timer/resume', [TimerController::class, 'resume'])
        ->name('resumeTimer');
    Route::post('/timer/trim', [TimerController::class, 'trim'])
        ->name('trimTimer');
    Route::post('/timer/stop', [TimerController::class, 'stop'])
        ->name('stopTimer');
});
