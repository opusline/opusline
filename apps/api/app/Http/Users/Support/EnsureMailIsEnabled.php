<?php

declare(strict_types=1);

namespace App\Http\Users\Support;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMailIsEnabled
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // A flow that only works by email does not exist on an instance that
        // sends none. Before validation and the throttle, like
        // EnsureRegistrationIsOpen: the route answers as if it were not there.
        abort_if(! config()->boolean('mail.enabled'), 404);

        return $next($request);
    }
}
