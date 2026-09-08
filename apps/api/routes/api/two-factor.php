<?php

declare(strict_types=1);

use App\Http\TwoFactor\Controllers\RecoveryCodeController;
use App\Http\TwoFactor\Controllers\TotpController;
use App\Http\TwoFactor\Controllers\TwoFactorController;
use App\Http\Users\Support\RequirePasswordConfirmation;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/user/two-factor', [TwoFactorController::class, 'show'])->name('showTwoFactor');

    Route::post('/user/two-factor/totp', [TotpController::class, 'start'])
        ->middleware(RequirePasswordConfirmation::class)
        ->name('startTotpSetup');
    Route::post('/user/two-factor/totp/confirm', [TotpController::class, 'confirm'])
        ->middleware('throttle:two-factor-setup')
        ->name('confirmTotp');
    Route::delete('/user/two-factor/totp', [TotpController::class, 'destroy'])
        ->middleware(RequirePasswordConfirmation::class)
        ->name('disableTotp');

    Route::get('/user/two-factor/recovery-codes', [RecoveryCodeController::class, 'show'])
        ->middleware(RequirePasswordConfirmation::class)
        ->name('showRecoveryCodes');
    Route::post('/user/two-factor/recovery-codes', [RecoveryCodeController::class, 'regenerate'])
        ->middleware(RequirePasswordConfirmation::class)
        ->name('regenerateRecoveryCodes');
});
