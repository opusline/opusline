<?php

declare(strict_types=1);

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use TimoKoerber\LaravelOneTimeOperations\OneTimeOperation;

/**
 * Until this release the "remember this browser" choice was skipped over by
 * the code field, so nobody has a trusted browser — and an account kept
 * signed in never reaches the challenge to make the choice now. Everyone is
 * signed out once: the remember-me tokens go, the sessions kept in the
 * database go, and whatever trust was recorded goes with them, so the next
 * sign-in runs the challenge with the box where it belongs. Sessions kept in
 * Redis or on disk are not touched; they end on their own at SESSION_LIFETIME.
 */
return new class extends OneTimeOperation
{
    // Part of the boot, like the migrations before it: a self-hoster may run
    // no queue worker at all, and a sign-out is too small to be worth one.
    protected bool $async = false;

    public function process(): void
    {
        DB::table('users')->update(['remember_token' => null]);
        DB::table('trusted_devices')->delete();

        if (Schema::hasTable(config()->string('session.table'))) {
            DB::table(config()->string('session.table'))->delete();
        }
    }
};
