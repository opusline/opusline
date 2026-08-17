<?php

declare(strict_types=1);

use App\Http\Bank\Controllers\TreasuryController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/treasury', [TreasuryController::class, 'show'])
        ->name('showTreasury');
    Route::post('/treasury/transfers', [TreasuryController::class, 'store'])
        ->name('recordTreasuryTransfer');
});
