<?php

declare(strict_types=1);

namespace App\Http\Users\Support;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * The inactivity lock, held by the server: a browser that locked itself stays
 * locked through a reload, a new tab or a cleared page, because the session
 * answers 401 until the password is confirmed again. 401 rather than 423 so the
 * SPA treats a locked session exactly like a lost one — the lock screen on a
 * page that is open, the login screen on one that is not.
 */
class EnsureSessionIsUnlocked
{
    public const string SESSION_KEY = 'auth.locked';

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        abort_if($request->hasSession() && $request->session()->get(self::SESSION_KEY) === true, 401, __('two-factor.session_locked'));

        return $next($request);
    }
}
