<?php

declare(strict_types=1);

use App\Domain\Users\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

test('a failed query names its statement, never the values bound into it', function (): void {
    User::factory()->create(['email' => 'nordlys@example.com']);

    try {
        DB::table('users')->insert([
            'name' => 'Nordlys Studio',
            'email' => 'nordlys@example.com',
            'password' => 'not-a-real-hash',
        ]);
    } catch (QueryException $exception) {
        expect($exception->getMessage())->not->toContain('nordlys@example.com');

        return;
    }

    $this->fail('The duplicate email should have violated the unique index.');
});

test('the calendar feed, whose URL is its credential, is never traced', function (): void {
    $feed = Route::getRoutes()->getByName('showDeadlineCalendar');

    expect(config('sentry.ignore_transactions'))->toContain('/'.$feed?->uri());
});
