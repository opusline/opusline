<?php

declare(strict_types=1);

use App\Http\Clients\Controllers\ClientController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/clients', [ClientController::class, 'index'])->name('listClients');
    Route::get('/clients/{client}', [ClientController::class, 'show'])
        ->whereNumber('client')
        ->name('showClient');
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
});
