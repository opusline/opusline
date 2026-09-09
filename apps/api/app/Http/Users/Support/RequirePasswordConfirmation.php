<?php

declare(strict_types=1);

namespace App\Http\Users\Support;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Laravel's own password.confirm middleware answers a redirect unless the
 * request advertises JSON, and the SPA's client sends no Accept header — so
 * this one always answers 423, the status the SPA turns into its password
 * dialog. The session key and the timeout are the framework's, so a login
 * still opens the window through Session::passwordConfirmed().
 */
class RequirePasswordConfirmation
{
    public const string SESSION_KEY = 'auth.password_confirmed_at';

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $confirmedAt = $request->session()->get(self::SESSION_KEY);
        $timeout = config()->integer('auth.password_timeout');

        abort_if(
            ! is_int($confirmedAt) || now()->getTimestamp() - $confirmedAt >= $timeout,
            423,
            __('two-factor.password_confirmation_required'),
        );

        return $next($request);
    }
}
