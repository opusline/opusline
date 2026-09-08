<?php

declare(strict_types=1);

use App\Http\Passkeys\Controllers\PasskeyController;
use App\Http\Passkeys\Controllers\PasskeyLoginController;
use App\Http\Users\Support\RequirePasswordConfirmation;
use Illuminate\Support\Facades\Route;

Route::post('/passkeys/login/options', [PasskeyLoginController::class, 'options'])
    ->middleware('throttle:passkey-login')
    ->name('passkeyLoginOptions');
Route::post('/passkeys/login', [PasskeyLoginController::class, 'store'])
    ->middleware('throttle:passkey-login')
    ->name('loginWithPasskey');

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/user/passkeys/options', [PasskeyController::class, 'options'])
        ->middleware(RequirePasswordConfirmation::class)
        ->name('passkeyRegistrationOptions');
    Route::post('/user/passkeys', [PasskeyController::class, 'store'])
        ->middleware(RequirePasswordConfirmation::class)
        ->name('registerPasskey');
    Route::put('/user/passkeys/{passkey}', [PasskeyController::class, 'update'])
        ->whereNumber('passkey')
        ->name('renamePasskey');
    Route::delete('/user/passkeys/{passkey}', [PasskeyController::class, 'destroy'])
        ->whereNumber('passkey')
        ->middleware(RequirePasswordConfirmation::class)
        ->name('deletePasskey');
});
