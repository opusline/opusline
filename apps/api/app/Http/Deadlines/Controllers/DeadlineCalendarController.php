<?php

declare(strict_types=1);

namespace App\Http\Deadlines\Controllers;

use App\Domain\Deadlines\Actions\BuildDeadlineCalendar;
use App\Domain\Deadlines\Actions\RecordCalendarFetch;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * The one unauthenticated route in the API: a calendar app subscribing to a
 * webcal:// URL cannot carry a session cookie, so the opaque token in the path
 * is the credential. It is long, random, rate limited and rotatable from the
 * Échéances screen, and it grants nothing but this read.
 *
 * Also the only machine-polled route, so it answers conditionally: the widest
 * fiscal window in the app is only recomputed when something the feed prints
 * has actually moved — see BuildDeadlineCalendar::fingerprint().
 */
class DeadlineCalendarController extends Controller
{
    /**
     * Private: the feed is per-account. The half hour matches the coarseness
     * of what moves daily, while the feed itself declares a 12-hour refresh
     * interval to its subscribers.
     */
    private const string CACHE_CONTROL = 'private, max-age=1800';

    public function show(
        string $token,
        Request $request,
        BuildDeadlineCalendar $buildDeadlineCalendar,
        RecordCalendarFetch $recordCalendarFetch,
    ): Response {
        $user = User::query()
            ->with('settings')
            ->whereRelation('settings', 'calendar_token', $token)
            ->first();

        abort_if($user === null, 404);

        $recordCalendarFetch->handle($user);

        $etag = '"'.$buildDeadlineCalendar->fingerprint($user).'"';

        // Symfony owns the If-None-Match comparison (weak validators, `*`,
        // lists); on a match it turns this into the 304 itself.
        $conditional = response('', 200, [
            'ETag' => $etag,
            'Cache-Control' => self::CACHE_CONTROL,
        ]);

        if ($conditional->isNotModified($request)) {
            return $conditional;
        }

        return response($buildDeadlineCalendar->handle($user), 200, [
            'Content-Type' => 'text/calendar; charset=utf-8',
            'Content-Disposition' => 'inline; filename="opusline.ics"',
            'ETag' => $etag,
            'Cache-Control' => self::CACHE_CONTROL,
        ]);
    }
}
