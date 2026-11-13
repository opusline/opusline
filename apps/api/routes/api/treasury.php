<?php

declare(strict_types=1);

use App\Domain\AccessTokens\Enums\TokenAbility;
use App\Http\Bank\Controllers\TreasuryController;
use App\Http\Users\Support\EnsureSessionIsUnlocked;
use App\Http\Users\Support\RefuseAccessTokens;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;

Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class])->group(function (): void {
    Route::get('/treasury', [TreasuryController::class, 'show'])
        ->middleware(CheckAbilities::class.':'.TokenAbility::ReadTreasury->value)
        ->name('showTreasury');
});

Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class, RefuseAccessTokens::class])->group(function (): void {
    Route::post('/treasury/transfers', [TreasuryController::class, 'storeTransfer'])
        ->name('createPersonalTransfer');

    Route::delete('/treasury/transfers/{transfer}', [TreasuryController::class, 'destroyTransfer'])
        ->whereNumber('transfer')
        ->name('deletePersonalTransfer');
});
