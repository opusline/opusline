<?php

declare(strict_types=1);

use App\Domain\Deadlines\Calendar\CalendarToken;
use App\Domain\Deadlines\Data\CompleteFiscalDeadlineData;
use App\Http\Deadlines\Controllers\DeadlineCalendarController;
use App\Http\Deadlines\Controllers\DeadlineController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/deadlines', [DeadlineController::class, 'index'])
        ->name('listDeadlines');

    Route::post('/deadlines/completions', [DeadlineController::class, 'storeCompletion'])
        ->name('completeDeadline');

    Route::delete('/deadlines/completions/{kind}/{periodKey}', [DeadlineController::class, 'destroyCompletion'])
        ->whereNumber('kind')
        ->where('periodKey', CompleteFiscalDeadlineData::PERIOD_KEY_EXPRESSION)
        ->name('uncompleteDeadline');

    Route::post('/deadlines/reminders/read', [DeadlineController::class, 'storeRemindersRead'])
        ->name('markDeadlineRemindersRead');

    Route::patch('/deadlines/calendar', [DeadlineController::class, 'updateCalendarFeed'])
        ->name('updateCalendarFeed');

    Route::post('/deadlines/calendar/token', [DeadlineController::class, 'storeCalendarToken'])
        ->name('regenerateCalendarToken');

    Route::post('/deadlines/calendar/subscription', [DeadlineController::class, 'storeCalendarSubscription'])
        ->name('confirmCalendarSubscription');

    Route::delete('/deadlines/calendar/subscription', [DeadlineController::class, 'destroyCalendarSubscription'])
        ->name('interruptCalendarSubscription');
});

// Outside the session guard on purpose: a calendar app subscribing to the feed
// sends no cookie. The token in the path is the credential — see
// DeadlineCalendarController — and its own limiter keeps guessing expensive.
Route::get('/calendar/{token}.ics', [DeadlineCalendarController::class, 'show'])
    ->where('token', '[A-Za-z0-9]{'.CalendarToken::LENGTH.'}')
    ->middleware('throttle:60,1')
    ->name('showDeadlineCalendar');
