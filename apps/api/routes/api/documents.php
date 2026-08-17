<?php

declare(strict_types=1);

use App\Http\Documents\Controllers\PersonalDocumentController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/documents', [PersonalDocumentController::class, 'index'])
        ->name('listPersonalDocuments');
    Route::post('/documents', [PersonalDocumentController::class, 'store'])
        ->middleware('throttle:uploads')
        ->name('uploadPersonalDocument');
    Route::put('/documents/{document}', [PersonalDocumentController::class, 'update'])
        ->whereNumber('document')
        ->name('updatePersonalDocument');
    Route::get('/documents/{document}/download', [PersonalDocumentController::class, 'download'])
        ->whereNumber('document')
        ->name('downloadPersonalDocument');
    Route::delete('/documents/{document}', [PersonalDocumentController::class, 'destroy'])
        ->whereNumber('document')
        ->name('deletePersonalDocument');
});
