<?php

declare(strict_types=1);

use App\Domain\AccessTokens\Enums\TokenAbility;
use App\Domain\Deadlines\Data\CompleteFiscalDeadlineData;
use App\Http\Declarations\Controllers\DeclarationController;
use App\Http\Users\Support\EnsureSessionIsUnlocked;
use App\Http\Users\Support\RefuseAccessTokens;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;

Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class])->group(function (): void {
    Route::get('/declarations', [DeclarationController::class, 'show'])
        ->middleware(CheckAbilities::class.':'.TokenAbility::ReadDeclarations->value)
        ->name('showDeclarations');
});

Route::middleware(['auth:sanctum', EnsureSessionIsUnlocked::class, RefuseAccessTokens::class])->group(function (): void {
    Route::post('/declarations/completions', [DeclarationController::class, 'storeCompletion'])
        ->name('markDeclarationFiled');

    Route::delete('/declarations/completions/{kind}/{periodKey}', [DeclarationController::class, 'destroyCompletion'])
        ->whereNumber('kind')
        ->where('periodKey', CompleteFiscalDeadlineData::PERIOD_KEY_EXPRESSION)
        ->name('unmarkDeclarationFiled');

    Route::post('/declarations/completions/{kind}/{periodKey}/payment', [DeclarationController::class, 'storePayment'])
        ->whereNumber('kind')
        ->where('periodKey', CompleteFiscalDeadlineData::PERIOD_KEY_EXPRESSION)
        ->name('recordDeclarationPayment');

    Route::delete('/declarations/completions/{kind}/{periodKey}/payment', [DeclarationController::class, 'destroyPayment'])
        ->whereNumber('kind')
        ->where('periodKey', CompleteFiscalDeadlineData::PERIOD_KEY_EXPRESSION)
        ->name('clearDeclarationPayment');
});
