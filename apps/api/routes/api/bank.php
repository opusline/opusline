<?php

declare(strict_types=1);

use App\Http\Bank\Controllers\BankController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/bank', [BankController::class, 'show'])
        ->name('showBankAccount');

    Route::put('/bank/balance', [BankController::class, 'updateBalance'])
        ->name('updateBankBalance');

    Route::post('/bank/statements', [BankController::class, 'importStatement'])
        ->middleware('throttle:uploads')
        ->name('importBankStatement');

    Route::post('/bank/matches/{match}/validate', [BankController::class, 'validateMatch'])
        ->whereNumber('match')
        ->name('validateBankMatch');

    Route::post('/bank/matches/{match}/dismiss', [BankController::class, 'dismissMatch'])
        ->whereNumber('match')
        ->name('dismissBankMatch');
});
