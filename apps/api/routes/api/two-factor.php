<?php

declare(strict_types=1);

use App\Http\TwoFactor\Controllers\RecoveryCodeController;
use App\Http\TwoFactor\Controllers\TotpController;
use App\Http\TwoFactor\Controllers\TrustedDeviceController;
use App\Http\TwoFactor\Controllers\TwoFactorChallengeController;
use App\Http\TwoFactor\Controllers\TwoFactorController;
use App\Http\Users\Support\RequirePasswordConfirmation;
use Illuminate\Support\Facades\Route;

Route::post('/two-factor-challenge', [TwoFactorChallengeController::class, 'store'])
    ->middleware('throttle:two-factor-challenge')
    ->name('answerTwoFactorChallenge');
Route::post('/two-factor-challenge/passkey-options', [TwoFactorChallengeController::class, 'passkeyOptions'])
    ->middleware('throttle:two-factor-challenge')
    ->name('twoFactorPasskeyOptions');

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

    Route::delete('/user/trusted-devices', [TrustedDeviceController::class, 'destroyAll'])
        ->name('revokeAllTrustedDevices');
    Route::delete('/user/trusted-devices/{trustedDevice}', [TrustedDeviceController::class, 'destroy'])
        ->whereNumber('trustedDevice')
        ->name('revokeTrustedDevice');
});
