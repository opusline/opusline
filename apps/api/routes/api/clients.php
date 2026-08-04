<?php

declare(strict_types=1);

use App\Http\Clients\Controllers\ClientController;
use App\Http\Clients\Controllers\ClientDocumentController;
use App\Http\Clients\Controllers\ClientLogoController;
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

    Route::post('/clients/{client}/logo', [ClientLogoController::class, 'store'])
        ->whereNumber('client')
        ->name('uploadClientLogo');
    Route::get('/clients/{client}/logo', [ClientLogoController::class, 'show'])
        ->whereNumber('client')
        ->name('showClientLogo');
    Route::delete('/clients/{client}/logo', [ClientLogoController::class, 'destroy'])
        ->whereNumber('client')
        ->name('deleteClientLogo');

    Route::get('/clients/{client}/documents', [ClientDocumentController::class, 'index'])
        ->whereNumber('client')
        ->name('listClientDocuments');
    Route::post('/clients/{client}/documents', [ClientDocumentController::class, 'store'])
        ->whereNumber('client')
        ->name('uploadClientDocument');
    Route::put('/clients/{client}/documents/{document}', [ClientDocumentController::class, 'update'])
        ->whereNumber(['client', 'document'])
        ->name('updateClientDocument');
    Route::get('/clients/{client}/documents/{document}/download', [ClientDocumentController::class, 'download'])
        ->whereNumber(['client', 'document'])
        ->name('downloadClientDocument');
    Route::delete('/clients/{client}/documents/{document}', [ClientDocumentController::class, 'destroy'])
        ->whereNumber(['client', 'document'])
        ->name('deleteClientDocument');
});
