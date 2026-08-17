<?php

declare(strict_types=1);

use App\Http\Missions\Controllers\MissionBillingController;
use App\Http\Missions\Controllers\MissionController;
use App\Http\Missions\Controllers\MissionDocumentController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->scopeBindings()->group(function (): void {
    Route::get('/clients/{client}/missions/{mission}', [MissionController::class, 'show'])
        ->name('showMission');
    Route::post('/clients/{client}/missions', [MissionController::class, 'store'])
        ->name('createMission');
    Route::put('/clients/{client}/missions/{mission}', [MissionController::class, 'update'])
        ->name('updateMission');
    Route::delete('/clients/{client}/missions/{mission}', [MissionController::class, 'destroy'])
        ->name('deleteMission');

    Route::get('/clients/{client}/missions/{mission}/billing', [MissionBillingController::class, 'show'])
        ->name('showMissionBilling');

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
