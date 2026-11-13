<?php

declare(strict_types=1);

use App\Domain\AccessTokens\Enums\TokenAbility;
use App\Http\Invoices\Controllers\ClientRevenueController;
use App\Http\Missions\Controllers\MissionController;
use App\Http\Missions\Controllers\MissionDocumentController;
use App\Http\Missions\Controllers\MissionTimeEntryController;
use App\Http\Users\Support\EnsureSessionIsUnlocked;
use App\Http\Users\Support\RefuseAccessTokens;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;

Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class])->group(function (): void {
    // The one cross-client mission read, and the only route here a personal
    // access token may take: it answers missions with their client's name, so
    // missions:read never opens /clients and the client's billing identity.
    Route::get('/missions', [MissionController::class, 'index'])
        ->middleware(CheckAbilities::class.':'.TokenAbility::ReadMissions->value)
        ->name('listMissions');
});

Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class, RefuseAccessTokens::class])->scopeBindings()->group(function (): void {
    Route::get('/clients/{client}/missions/{mission}', [MissionController::class, 'show'])
        ->name('showMission');
    Route::get('/clients/{client}/missions/{mission}/revenue', [ClientRevenueController::class, 'showMission'])
        ->name('showMissionRevenue');
    Route::post('/clients/{client}/missions', [MissionController::class, 'store'])
        ->name('createMission');
    Route::put('/clients/{client}/missions/{mission}', [MissionController::class, 'update'])
        ->name('updateMission');
    Route::delete('/clients/{client}/missions/{mission}', [MissionController::class, 'destroy'])
        ->name('deleteMission');

    Route::get('/clients/{client}/missions/{mission}/time-entries', [MissionTimeEntryController::class, 'index'])
        ->name('listMissionTimeEntries');

    Route::get('/clients/{client}/missions/{mission}/documents', [MissionDocumentController::class, 'index'])
        ->name('listMissionDocuments');
    Route::post('/clients/{client}/missions/{mission}/documents', [MissionDocumentController::class, 'store'])
        ->middleware('throttle:uploads')
        ->name('uploadMissionDocument');
    Route::put('/clients/{client}/missions/{mission}/documents/{document}', [MissionDocumentController::class, 'update'])
        ->whereNumber('document')
        ->name('updateMissionDocument');
    Route::get('/clients/{client}/missions/{mission}/documents/{document}/download', [MissionDocumentController::class, 'download'])
        ->whereNumber('document')
        ->name('downloadMissionDocument');
    Route::delete('/clients/{client}/missions/{mission}/documents/{document}', [MissionDocumentController::class, 'destroy'])
        ->whereNumber('document')
        ->name('deleteMissionDocument');
});
