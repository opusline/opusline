<?php

declare(strict_types=1);

use App\Http\Expenses\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/subscriptions', [SubscriptionController::class, 'index'])
        ->name('listSubscriptions');

    Route::post('/subscriptions', [SubscriptionController::class, 'store'])
        ->name('createSubscription');

    Route::post('/subscriptions/detected-debits/dismissals', [SubscriptionController::class, 'storeDismissal'])
        ->name('dismissRecurringDebit');

    Route::put('/subscriptions/{subscription}', [SubscriptionController::class, 'update'])
        ->whereNumber('subscription')
        ->name('updateSubscription');

    Route::delete('/subscriptions/{subscription}', [SubscriptionController::class, 'destroy'])
        ->whereNumber('subscription')
        ->name('deleteSubscription');

    Route::post('/subscriptions/{subscription}/amounts', [SubscriptionController::class, 'storeAmount'])
        ->whereNumber('subscription')
        ->name('changeSubscriptionAmount');

    Route::post('/subscriptions/{subscription}/pause', [SubscriptionController::class, 'storePause'])
        ->whereNumber('subscription')
        ->name('pauseSubscription');

    Route::delete('/subscriptions/{subscription}/pause', [SubscriptionController::class, 'destroyPause'])
        ->whereNumber('subscription')
        ->name('resumeSubscription');

    Route::post('/subscriptions/{subscription}/cancellation', [SubscriptionController::class, 'storeCancellation'])
        ->whereNumber('subscription')
        ->name('cancelSubscription');

    Route::delete('/subscriptions/{subscription}/cancellation', [SubscriptionController::class, 'destroyCancellation'])
        ->whereNumber('subscription')
        ->name('reactivateSubscription');
});
