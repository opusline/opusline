<?php

declare(strict_types=1);

namespace App\Http\Deadlines\Controllers;

use App\Domain\Deadlines\Actions\BuildDeadlineCalendar;
use App\Domain\Deadlines\Actions\RecordCalendarFetch;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;

/**
 * The one unauthenticated route in the API: a calendar app subscribing to a
 * webcal:// URL cannot carry a session cookie, so the opaque token in the path
 * is the credential. It is long, random, rate limited and rotatable from the
 * Échéances screen, and it grants nothing but this read.
 */
class DeadlineCalendarController extends Controller
{
    public function show(
        string $token,
        BuildDeadlineCalendar $buildDeadlineCalendar,
        RecordCalendarFetch $recordCalendarFetch,
    ): Response {
        $user = User::query()
            ->with('settings')
            ->whereRelation('settings', 'calendar_token', $token)
            ->first();

        abort_if($user === null, 404);

        $recordCalendarFetch->handle($user);

        return response($buildDeadlineCalendar->handle($user), 200, [
            'Content-Type' => 'text/calendar; charset=utf-8',
            'Content-Disposition' => 'inline; filename="opusline.ics"',
            // A feed is per-account and moves with every invoice paid.
            'Cache-Control' => 'no-store, private',
        ]);
    }
}
