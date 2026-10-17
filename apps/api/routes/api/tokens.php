<?php

declare(strict_types=1);

use App\Http\AccessTokens\Controllers\AccessTokenController;
use App\Http\Users\Support\EnsureSessionIsUnlocked;
use App\Http\Users\Support\RefuseAccessTokens;
use App\Http\Users\Support\RequirePasswordConfirmation;
use Illuminate\Support\Facades\Route;

// A token cannot mint, list or revoke tokens: that is the signed-in owner's.
Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class, RefuseAccessTokens::class])->group(function (): void {
    Route::get('/user/tokens', [AccessTokenController::class, 'index'])->name('listAccessTokens');
    Route::post('/user/tokens', [AccessTokenController::class, 'store'])
        ->middleware(RequirePasswordConfirmation::class)
        ->name('createAccessToken');
    Route::delete('/user/tokens/{token}', [AccessTokenController::class, 'destroy'])
        ->whereNumber('token')
        ->name('revokeAccessToken');
});
