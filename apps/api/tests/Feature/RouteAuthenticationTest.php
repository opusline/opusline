<?php

declare(strict_types=1);

use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Route;

/**
 * The API routes that answer without a session, and the reason each one has to.
 *
 * Ownership is enforced by the route binding rather than by a policy layer, so
 * "is this route behind the guard?" is the whole authorization model — and it
 * lives in nothing more durable than each route file opening with a
 * `Route::middleware('auth:sanctum')` group.
 */
const PUBLIC_API_ROUTES = [
    // A liveness probe: returns the status, the version and the browser's
    // Sentry project, reads nothing.
    'api/ping',
    'api/login',
    'api/register',
    // The caller has proven the password but is not signed in yet; the
    // account it answers for lives in the guest session. See PendingLogin.
    'api/two-factor-challenge',
    'api/two-factor-challenge/passkey-options',
    // Passwordless sign-in: the assertion the browser sends is the
    // credential. See AuthenticatePasskey.
    'api/passkeys/login/options',
    'api/passkeys/login',
    // A calendar app sends no cookie; the opaque token in the path is the
    // credential. See DeadlineCalendarController.
    'api/calendar/{token}.ics',
];

test('every API route but the eight documented public ones is behind auth:sanctum', function (): void {
    $unauthenticated = collect(Route::getRoutes()->getRoutes())
        ->filter(fn (RoutingRoute $route): bool => str_starts_with($route->uri(), 'api/'))
        ->reject(fn (RoutingRoute $route): bool => in_array(
            Authenticate::class.':sanctum',
            Route::gatherRouteMiddleware($route),
            true,
        ))
        ->map(fn (RoutingRoute $route): string => $route->uri())
        ->unique()
        ->sort()
        ->values()
        ->all();

    expect($unauthenticated)->toBe(
        collect(PUBLIC_API_ROUTES)->sort()->values()->all(),
        'An API route is reachable without a session. Put it inside the file\'s '
        .'auth:sanctum group, or — if it genuinely has to be public — add it to '
        .'PUBLIC_API_ROUTES with the reason it can be.',
    );
});
