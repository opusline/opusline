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
    Route::put('/clients/{client}', [ClientController::class, 'update'])
        ->whereNumber('client')
        ->name('updateClient');
    Route::post('/clients/{client}/archive', [ClientController::class, 'archive'])
        ->whereNumber('client')
        ->name('archiveClient');
    Route::post('/clients/{client}/unarchive', [ClientController::class, 'unarchive'])
        ->whereNumber('client')
        ->name('unarchiveClient');
    Route::delete('/clients/{client}', [ClientController::class, 'destroy'])
        ->whereNumber('client')
        ->name('deleteClient');

    Route::post('/clients/{client}/missions', [MissionController::class, 'store'])
        ->whereNumber('client')
        ->name('createMission');
    Route::put('/clients/{client}/missions/{mission}', [MissionController::class, 'update'])
        ->whereNumber(['client', 'mission'])
        ->name('updateMission');
    Route::delete('/clients/{client}/missions/{mission}', [MissionController::class, 'destroy'])
        ->whereNumber(['client', 'mission'])
        ->name('deleteMission');
});
