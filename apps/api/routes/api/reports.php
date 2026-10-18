<?php

declare(strict_types=1);

use App\Http\Feedback\Controllers\ReportController;
use App\Http\Feedback\Support\EnsureReportsAreEnabled;
use App\Http\Users\Support\EnsureSessionIsUnlocked;
use App\Http\Users\Support\RefuseAccessTokens;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class, RefuseAccessTokens::class, EnsureReportsAreEnabled::class])->group(function (): void {
    Route::post('/reports', [ReportController::class, 'store'])
        ->middleware('throttle:reports')
        ->name('sendReport');
});
