<?php

declare(strict_types=1);

namespace App\Http\Users\Support;

use App\Domain\Users\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRegistrationIsOpen
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 404, not 403 — a closed endpoint should not advertise that it
        // exists. Runs before validation for the same reason: a 422 would
        // reveal it too. The zero-users exception lets the operator create
        // the first account on an instance configured closed from day one.
        abort_if(
            ! config()->boolean('auth.registration_enabled') && User::query()->exists(),
            404,
        );

        return $next($request);
    }
}
