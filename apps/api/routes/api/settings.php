<?php

declare(strict_types=1);

use App\Http\Settings\Controllers\SettingsController;
use App\Http\Settings\Controllers\SignatureController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/settings', [SettingsController::class, 'show'])->name('showSettings');
    Route::put('/settings', [SettingsController::class, 'update'])->name('updateSettings');
    Route::put('/settings/currency', [SettingsController::class, 'updateCurrency'])->name('updateSettingsCurrency');
    Route::post('/settings/rates/refresh', [SettingsController::class, 'refreshRates'])
        ->middleware('throttle:6,1')
        ->name('refreshSettingsRates');

    Route::post('/user/signature', [SignatureController::class, 'store'])
        ->middleware('throttle:uploads')
        ->name('uploadUserSignature');
    Route::get('/user/signature', [SignatureController::class, 'show'])
        ->name('showUserSignature');
    Route::delete('/user/signature', [SignatureController::class, 'destroy'])
        ->name('deleteUserSignature');
});
