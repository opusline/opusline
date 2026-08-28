<?php

declare(strict_types=1);

use App\Http\Declarations\Controllers\DeclarationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/declarations', [DeclarationController::class, 'show'])
        ->name('showDeclarations');
});
