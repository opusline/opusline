<?php

declare(strict_types=1);

use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

// Laravel masks the bindings it interpolates into the statement. What the
// driver says about the failure is the driver's own text — MySQL and Postgres
// quote the conflicting value of a unique violation — so the probe is a failure
// whose driver message carries no value: only the masking is under test.
test('a failed query names its statement, never the values bound into it', function (): void {
    try {
        DB::table('no_such_table')->where('email', 'nordlys@example.com')->get();
    } catch (QueryException $exception) {
        expect($exception->getMessage())
            ->toContain('no_such_table')
            ->not->toContain('nordlys@example.com');

        return;
    }

    $this->fail('A query on a missing table should have failed.');
});

test('the calendar feed, whose URL is its credential, is never traced', function (): void {
    $feed = Route::getRoutes()->getByName('showDeadlineCalendar');

    expect(config('sentry.ignore_transactions'))->toContain('/'.$feed?->uri());
});
