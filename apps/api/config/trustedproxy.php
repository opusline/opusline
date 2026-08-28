<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Trusted Proxies
    |--------------------------------------------------------------------------
    |
    | The proxies whose X-Forwarded-* headers may be believed. Laravel's
    | TrustProxies middleware reads this key when nothing was configured on the
    | middleware itself.
    |
    | Null trusts none, which is what an app reachable directly from the internet
    | wants: believing a header nobody set is how a rate limit keyed on the
    | client address gets spoofed. A self-hosted install sets '*' — there the app
    | answers only through its own reverse proxy, and without it every request
    | carries the proxy's address, so the login throttle is shared by everyone
    | and no request ever looks secure.
    |
    */

    'proxies' => env('TRUSTED_PROXIES'),

];
