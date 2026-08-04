<?php

declare(strict_types=1);

use App\Http\Clients\Controllers\ClientController;
use App\Http\Clients\Controllers\ClientDocumentController;
use App\Http\Clients\Controllers\ClientLogoController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/clients', [ClientController::class, 'index'])->name('listClients');
    Route::get('/clients/{client}', [ClientController::class, 'show'])
        ->where('client', '[a-z0-9-]+')
        ->name('showClient');
    Route::post('/clients', [ClientController::class, 'store'])->name('createClient');
    Route::put('/clients/{client}', [ClientController::class, 'update'])
        ->where('client', '[a-z0-9-]+')
        ->name('updateClient');
    Route::post('/clients/{client}/archive', [ClientController::class, 'archive'])
        ->where('client', '[a-z0-9-]+')
        ->name('archiveClient');
    Route::post('/clients/{client}/unarchive', [ClientController::class, 'unarchive'])
        ->where('client', '[a-z0-9-]+')
        ->name('unarchiveClient');
    Route::delete('/clients/{client}', [ClientController::class, 'destroy'])
        ->where('client', '[a-z0-9-]+')
        ->name('deleteClient');

    Route::post('/clients/{client}/logo', [ClientLogoController::class, 'store'])
        ->where('client', '[a-z0-9-]+')
        ->name('uploadClientLogo');
    Route::get('/clients/{client}/logo', [ClientLogoController::class, 'show'])
        ->where('client', '[a-z0-9-]+')
        ->name('showClientLogo');
    Route::delete('/clients/{client}/logo', [ClientLogoController::class, 'destroy'])
        ->where('client', '[a-z0-9-]+')
        ->name('deleteClientLogo');

    Route::get('/clients/{client}/documents', [ClientDocumentController::class, 'index'])
        ->where('client', '[a-z0-9-]+')
        ->name('listClientDocuments');
    Route::post('/clients/{client}/documents', [ClientDocumentController::class, 'store'])
        ->where('client', '[a-z0-9-]+')
        ->name('uploadClientDocument');
    Route::put('/clients/{client}/documents/{document}', [ClientDocumentController::class, 'update'])
        ->where('client', '[a-z0-9-]+')->whereNumber('document')
        ->name('updateClientDocument');
    Route::get('/clients/{client}/documents/{document}/download', [ClientDocumentController::class, 'download'])
        ->where('client', '[a-z0-9-]+')->whereNumber('document')
        ->name('downloadClientDocument');
    Route::delete('/clients/{client}/documents/{document}', [ClientDocumentController::class, 'destroy'])
        ->where('client', '[a-z0-9-]+')->whereNumber('document')
        ->name('deleteClientDocument');
});
