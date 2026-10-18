<?php

declare(strict_types=1);

use App\Http\Feedback\Controllers\RelayController;
use App\Http\Feedback\Support\EnsureRelayIsEnabled;
use Illuminate\Support\Facades\Route;

// Public on purpose: other instances call these server to server, with no
// account here. The proof of work and the rate limits stand in for a login.
Route::middleware(EnsureRelayIsEnabled::class)->group(function (): void {
    Route::get('/relay/challenge', [RelayController::class, 'challenge'])
        ->middleware('throttle:relay-challenges')
        ->name('issueRelayChallenge');
    Route::post('/relay/reports', [RelayController::class, 'store'])
        ->middleware('throttle:relay-reports')
        ->name('fileRelayedReport');
});
