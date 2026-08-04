<?php

declare(strict_types=1);

use App\Http\Missions\Controllers\MissionController;
use App\Http\Missions\Controllers\MissionDocumentController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->scopeBindings()->group(function (): void {
    Route::get('/clients/{client}/missions/{mission}', [MissionController::class, 'show'])
        ->where('client', '[a-z0-9-]+')->whereNumber('mission')
        ->name('showMission');
    Route::post('/clients/{client}/missions', [MissionController::class, 'store'])
        ->where('client', '[a-z0-9-]+')
        ->name('createMission');
    Route::put('/clients/{client}/missions/{mission}', [MissionController::class, 'update'])
        ->where('client', '[a-z0-9-]+')->whereNumber('mission')
        ->name('updateMission');
    Route::delete('/clients/{client}/missions/{mission}', [MissionController::class, 'destroy'])
        ->where('client', '[a-z0-9-]+')->whereNumber('mission')
        ->name('deleteMission');

    Route::get('/clients/{client}/missions/{mission}/documents', [MissionDocumentController::class, 'index'])
        ->where('client', '[a-z0-9-]+')->whereNumber('mission')
        ->name('listMissionDocuments');
    Route::post('/clients/{client}/missions/{mission}/documents', [MissionDocumentController::class, 'store'])
        ->where('client', '[a-z0-9-]+')->whereNumber('mission')
        ->name('uploadMissionDocument');
    Route::put('/clients/{client}/missions/{mission}/documents/{document}', [MissionDocumentController::class, 'update'])
        ->where('client', '[a-z0-9-]+')->whereNumber(['mission', 'document'])
        ->name('updateMissionDocument');
    Route::get('/clients/{client}/missions/{mission}/documents/{document}/download', [MissionDocumentController::class, 'download'])
        ->where('client', '[a-z0-9-]+')->whereNumber(['mission', 'document'])
        ->name('downloadMissionDocument');
    Route::delete('/clients/{client}/missions/{mission}/documents/{document}', [MissionDocumentController::class, 'destroy'])
        ->where('client', '[a-z0-9-]+')->whereNumber(['mission', 'document'])
        ->name('deleteMissionDocument');
});
