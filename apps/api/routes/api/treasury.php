<?php

declare(strict_types=1);

use App\Http\Bank\Controllers\TreasuryController;
use App\Http\Users\Support\EnsureSessionIsUnlocked;
use App\Http\Users\Support\RefuseAccessTokens;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class, RefuseAccessTokens::class])->group(function (): void {
    Route::get('/treasury', [TreasuryController::class, 'show'])
        ->name('showTreasury');

    Route::post('/treasury/transfers', [TreasuryController::class, 'storeTransfer'])
        ->name('createPersonalTransfer');

    Route::delete('/treasury/transfers/{transfer}', [TreasuryController::class, 'destroyTransfer'])
        ->whereNumber('transfer')
        ->name('deletePersonalTransfer');
});
