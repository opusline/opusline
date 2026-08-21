<?php

declare(strict_types=1);

use App\Http\Documents\Controllers\DocumentLibraryController;
use App\Http\Documents\Controllers\UserDocumentController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/documents', [DocumentLibraryController::class, 'index'])
        ->name('listDocumentLibrary');

    Route::get('/user/documents', [UserDocumentController::class, 'index'])
        ->name('listUserDocuments');
    Route::post('/user/documents', [UserDocumentController::class, 'store'])
        ->middleware('throttle:uploads')
        ->name('uploadUserDocument');
    Route::put('/user/documents/{document}', [UserDocumentController::class, 'update'])
        ->whereNumber('document')
        ->name('updateUserDocument');
    Route::get('/user/documents/{document}/download', [UserDocumentController::class, 'download'])
        ->whereNumber('document')
        ->name('downloadUserDocument');
    Route::delete('/user/documents/{document}', [UserDocumentController::class, 'destroy'])
        ->whereNumber('document')
        ->name('deleteUserDocument');
});
