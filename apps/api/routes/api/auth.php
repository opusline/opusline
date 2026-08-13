<?php

declare(strict_types=1);

use App\Http\Users\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:6,1')
    ->name('register');

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:6,1')
    ->name('login');

Route::middleware('auth:sanctum')->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/user', [AuthController::class, 'currentUser'])->name('currentUser');
    Route::put('/user/theme', [AuthController::class, 'updateTheme'])->name('updateUserTheme');
});
