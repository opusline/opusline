<?php

declare(strict_types=1);

use App\Http\Bank\Controllers\BankConnectionController;
use App\Http\Bank\Controllers\BankController;
use App\Http\Users\Support\EnsureSessionIsUnlocked;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class])->group(function (): void {
    Route::get('/bank', [BankController::class, 'show'])
        ->name('showBankAccount');

    Route::get('/bank/movements', [BankController::class, 'movements'])
        ->name('listBankMovements');

    Route::put('/bank/balance', [BankController::class, 'updateBalance'])
        ->name('updateBankBalance');

    Route::post('/bank/statements', [BankController::class, 'importStatement'])
        ->middleware('throttle:uploads')
        ->name('importBankStatement');

    Route::get('/bank/aspsps', [BankConnectionController::class, 'aspsps'])
        ->name('listBankAspsps');

    Route::post('/bank/connection', [BankConnectionController::class, 'start'])
        ->middleware('throttle:6,1')
        ->name('startBankConnection');

    Route::post('/bank/connection/complete', [BankConnectionController::class, 'complete'])
        ->middleware('throttle:6,1')
        ->name('completeBankConnection');

    Route::put('/bank/connection/account', [BankConnectionController::class, 'chooseAccount'])
        ->name('chooseBankConnectionAccount');

    // Each sync is a read at the bank, which PSD2 lets it ration.
    Route::post('/bank/connection/sync', [BankConnectionController::class, 'sync'])
        ->middleware('throttle:6,1')
        ->name('syncBankConnection');

    Route::delete('/bank/connection', [BankConnectionController::class, 'disconnect'])
        ->name('disconnectBankConnection');

    Route::post('/bank/matches/{match}/validate', [BankController::class, 'validateMatch'])
        ->whereNumber('match')
        ->name('validateBankMatch');

    Route::post('/bank/matches/{match}/dismiss', [BankController::class, 'dismissMatch'])
        ->whereNumber('match')
        ->name('dismissBankMatch');
});
