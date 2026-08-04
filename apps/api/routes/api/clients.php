<?php

declare(strict_types=1);

use App\Http\Clients\Controllers\ClientController;
use App\Http\Clients\Controllers\ClientDocumentController;
use App\Http\Clients\Controllers\ClientLogoController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/clients', [ClientController::class, 'index'])->name('listClients');
    Route::get('/clients/{client}', [ClientController::class, 'show'])
        ->name('showClient');
    Route::post('/clients', [ClientController::class, 'store'])->name('createClient');
    Route::put('/clients/{client}', [ClientController::class, 'update'])
        ->name('updateClient');
    Route::post('/clients/{client}/archive', [ClientController::class, 'archive'])
        ->name('archiveClient');
    Route::post('/clients/{client}/unarchive', [ClientController::class, 'unarchive'])
        ->name('unarchiveClient');
    Route::delete('/clients/{client}', [ClientController::class, 'destroy'])
        ->name('deleteClient');

    Route::post('/clients/{client}/logo', [ClientLogoController::class, 'store'])
        ->name('uploadClientLogo');
    Route::get('/clients/{client}/logo', [ClientLogoController::class, 'show'])
        ->name('showClientLogo');
    Route::delete('/clients/{client}/logo', [ClientLogoController::class, 'destroy'])
        ->name('deleteClientLogo');

    Route::get('/clients/{client}/documents', [ClientDocumentController::class, 'index'])
        ->name('listClientDocuments');
    Route::post('/clients/{client}/documents', [ClientDocumentController::class, 'store'])
        ->name('uploadClientDocument');
    Route::put('/clients/{client}/documents/{document}', [ClientDocumentController::class, 'update'])
        ->whereNumber('document')
        ->name('updateClientDocument');
    Route::get('/clients/{client}/documents/{document}/download', [ClientDocumentController::class, 'download'])
        ->whereNumber('document')
        ->name('downloadClientDocument');
    Route::delete('/clients/{client}/documents/{document}', [ClientDocumentController::class, 'destroy'])
        ->whereNumber('document')
        ->name('deleteClientDocument');
});
