<?php

declare(strict_types=1);

use App\Domain\Deadlines\Data\CompleteFiscalDeadlineData;
use App\Http\Declarations\Controllers\DeclarationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/declarations', [DeclarationController::class, 'show'])
        ->name('showDeclarations');

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
