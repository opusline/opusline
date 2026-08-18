<?php

declare(strict_types=1);

use App\Http\TimeEntries\Controllers\TimeEntryController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/time-entries', [TimeEntryController::class, 'index'])
        ->name('listTimeEntries');
    Route::get('/time-entries/month-workload', [TimeEntryController::class, 'monthWorkload'])
        ->name('summarizeMonthWorkload');
    Route::post('/time-entries', [TimeEntryController::class, 'store'])
        ->name('createTimeEntry');
    Route::put('/time-entries/{timeEntry}', [TimeEntryController::class, 'update'])
        ->whereNumber('timeEntry')
        ->name('updateTimeEntry');
    Route::delete('/time-entries/{timeEntry}', [TimeEntryController::class, 'destroy'])
        ->whereNumber('timeEntry')
        ->name('deleteTimeEntry');
});
