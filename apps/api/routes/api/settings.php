<?php

declare(strict_types=1);

use App\Http\Features\Support\EnsureFeatureIsActive;
use App\Http\Settings\Controllers\CompanyLogoController;
use App\Http\Settings\Controllers\InstanceController;
use App\Http\Settings\Controllers\IntegrationsController;
use App\Http\Settings\Controllers\SettingsController;
use App\Http\Settings\Controllers\SignatureController;
use App\Http\Users\Support\EnsureMailIsEnabled;
use App\Http\Users\Support\EnsureSessionIsUnlocked;
use App\Http\Users\Support\RefuseAccessTokens;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class, RefuseAccessTokens::class])->group(function (): void {
    Route::get('/instance', [InstanceController::class, 'show'])->name('showInstance');

    Route::get('/settings', [SettingsController::class, 'show'])->name('showSettings');
    Route::put('/settings', [SettingsController::class, 'update'])->name('updateSettings');
    Route::put('/settings/currency', [SettingsController::class, 'updateCurrency'])->name('updateSettingsCurrency');
    Route::put('/settings/notifications', [SettingsController::class, 'updateNotifications'])->name('updateNotificationPreferences');
    Route::post('/settings/notifications/test-email', [SettingsController::class, 'sendTestEmail'])
        ->middleware([EnsureMailIsEnabled::class, 'throttle:mail-test'])
        ->name('sendTestEmail');
    Route::post('/settings/rates/refresh', [SettingsController::class, 'refreshRates'])
        ->middleware('throttle:6,1')
        ->name('refreshSettingsRates');

    Route::get('/settings/integrations', [IntegrationsController::class, 'show'])->name('showIntegrations');
    Route::put('/settings/integrations/enable-banking', [IntegrationsController::class, 'saveEnableBanking'])
        ->middleware('throttle:6,1')
        ->name('saveEnableBankingCredentials');
    Route::delete('/settings/integrations/enable-banking', [IntegrationsController::class, 'deleteEnableBanking'])
        ->name('deleteEnableBankingCredentials');
    // The connection serves nothing until the e-invoicing rungs land: behind
    // the invoicing flag with them, so a flag-off instance is unchanged.
    Route::middleware(EnsureFeatureIsActive::class.':invoicing')->group(function (): void {
        Route::put('/settings/integrations/super-pdp', [IntegrationsController::class, 'saveSuperPdp'])
            ->middleware('throttle:6,1')
            ->name('saveSuperPdpCredentials');
        Route::post('/settings/integrations/super-pdp/check', [IntegrationsController::class, 'checkSuperPdp'])
            ->middleware('throttle:6,1')
            ->name('checkSuperPdpConnection');
        Route::delete('/settings/integrations/super-pdp', [IntegrationsController::class, 'deleteSuperPdp'])
            ->name('deleteSuperPdpCredentials');
    });

    Route::post('/user/signature', [SignatureController::class, 'store'])
        ->middleware('throttle:uploads')
        ->name('uploadUserSignature');
    Route::get('/user/signature', [SignatureController::class, 'show'])
        ->name('showUserSignature');
    Route::delete('/user/signature', [SignatureController::class, 'destroy'])
        ->name('deleteUserSignature');

    Route::post('/user/logo', [CompanyLogoController::class, 'store'])
        ->middleware('throttle:uploads')
        ->name('uploadCompanyLogo');
    Route::get('/user/logo', [CompanyLogoController::class, 'show'])
        ->name('showCompanyLogo');
    Route::delete('/user/logo', [CompanyLogoController::class, 'destroy'])
        ->name('deleteCompanyLogo');
});
