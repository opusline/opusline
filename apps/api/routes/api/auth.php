<?php

declare(strict_types=1);

use App\Http\Users\Controllers\AuthController;
use App\Http\Users\Support\EnsureRegistrationIsOpen;
use App\Http\Users\Support\EnsureSessionIsUnlocked;
use App\Http\Users\Support\RequirePasswordConfirmation;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])
    ->middleware([EnsureRegistrationIsOpen::class, 'throttle:6,1'])
    ->name('register');

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:login')
    ->name('login');

Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class])->group(function (): void {
    // Logout and confirm-password are the two ways out of a locked session.
    Route::post('/logout', [AuthController::class, 'logout'])
        ->withoutMiddleware(EnsureSessionIsUnlocked::class)
        ->name('logout');
    Route::get('/user', [AuthController::class, 'currentUser'])->name('currentUser');
    Route::post('/user/confirm-password', [AuthController::class, 'confirmPassword'])
        ->withoutMiddleware(EnsureSessionIsUnlocked::class)
        ->middleware('throttle:confirm-password')
        ->name('confirmPassword');
    Route::post('/user/session-lock', [AuthController::class, 'lockSession'])->name('lockSession');
    Route::put('/user/password', [AuthController::class, 'updatePassword'])
        ->middleware(RequirePasswordConfirmation::class)
        ->name('updateUserPassword');
    Route::put('/user/theme', [AuthController::class, 'updateTheme'])->name('updateUserTheme');
    Route::put('/user/release-notes-seen', [AuthController::class, 'updateReleaseNotesSeen'])->name('updateUserReleaseNotesSeen');
});
