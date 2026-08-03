<?php

declare(strict_types=1);

use App\Http\Clients\Controllers\ClientController;
use App\Http\Missions\Controllers\MissionController;
use App\Http\Users\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', fn () => response()->json([
    'status' => 'ok',
    'version' => config()->string('app.version'),
]));

Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:6,1')
    ->name('register');

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:6,1')
    ->name('login');

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/user', [AuthController::class, 'currentUser'])->name('currentUser');

    Route::get('/clients', [ClientController::class, 'index'])->name('listClients');
    Route::post('/clients', [ClientController::class, 'store'])->name('createClient');
    Route::put('/clients/{clientSlug}', [ClientController::class, 'update'])
        ->where('clientSlug', '[a-z0-9-]+')
        ->name('updateClient');
    Route::post('/clients/{clientSlug}/archive', [ClientController::class, 'archive'])
        ->where('clientSlug', '[a-z0-9-]+')
        ->name('archiveClient');
    Route::post('/clients/{clientSlug}/unarchive', [ClientController::class, 'unarchive'])
        ->where('clientSlug', '[a-z0-9-]+')
        ->name('unarchiveClient');
    Route::delete('/clients/{clientSlug}', [ClientController::class, 'destroy'])
        ->where('clientSlug', '[a-z0-9-]+')
        ->name('deleteClient');

    Route::post('/missions', [MissionController::class, 'store'])->name('createMission');
    Route::put('/missions/{missionId}', [MissionController::class, 'update'])
        ->whereNumber('missionId')
        ->name('updateMission');
    Route::delete('/missions/{missionId}', [MissionController::class, 'destroy'])
        ->whereNumber('missionId')
        ->name('deleteMission');
});
