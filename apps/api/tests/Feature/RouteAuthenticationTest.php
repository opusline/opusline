<?php

declare(strict_types=1);

use App\Domain\AccessTokens\Enums\TokenAbility;
use App\Http\Users\Support\EnsureSessionIsUnlocked;
use App\Http\Users\Support\RefuseAccessTokens;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;

/**
 * The API routes that answer without a session, and the reason each one has to.
 *
 * Ownership is enforced by the route binding rather than by a policy layer, so
 * "is this route behind the guard?" is the whole authorization model — and it
 * lives in nothing more durable than each route file opening with a
 * `Route::middleware('auth:sanctum')` group.
 */
const PUBLIC_API_ROUTES = [
    // A liveness probe: returns the status, the version, the browser's Sentry
    // project and whether the instance sends mail, reads nothing.
    'api/ping',
    'api/login',
    'api/register',
    // A forgotten password is recovered by someone who cannot sign in; the
    // emailed token is the credential. See ResetForgottenPassword.
    'api/forgot-password',
    'api/reset-password',
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
    // The report relay: other instances call it server to server with no
    // account here; a proof of work and rate limits gate it. See FileRelayedReport.
    'api/relay/challenge',
    'api/relay/reports',
];

test('every API route but the documented public ones is behind auth:sanctum', function (): void {
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

/** The routes a locked session must still reach: the ways out of the lock. */
const LOCK_EXEMPT_API_ROUTES = [
    'api/logout',
    'api/user/confirm-password',
];

test('every authenticated API route but the ways out refuses a locked session', function (): void {
    $unguarded = collect(Route::getRoutes()->getRoutes())
        ->filter(fn (RoutingRoute $route): bool => str_starts_with($route->uri(), 'api/'))
        ->filter(fn (RoutingRoute $route): bool => in_array(
            Authenticate::class.':sanctum',
            Route::gatherRouteMiddleware($route),
            true,
        ))
        ->reject(fn (RoutingRoute $route): bool => in_array(
            EnsureSessionIsUnlocked::class,
            Route::gatherRouteMiddleware($route),
            true,
        ))
        ->map(fn (RoutingRoute $route): string => $route->uri())
        ->unique()
        ->sort()
        ->values()
        ->all();

    expect($unguarded)->toBe(
        collect(LOCK_EXEMPT_API_ROUTES)->sort()->values()->all(),
        'An authenticated API route answers a locked session. Open its file\'s '
        .'group with EnsureSessionIsUnlocked next to auth:sanctum, or — if a locked '
        .'session genuinely has to reach it — add it to LOCK_EXEMPT_API_ROUTES.',
    );
});

/** The reads a personal access token carrying invoices:read may make, and nothing else. */
const TOKEN_API_ROUTES = [
    'api/invoices',
    'api/invoices/{invoice}',
];

test('every authenticated API route but the invoice reads refuses a personal access token', function (): void {
    $open = collect(Route::getRoutes()->getRoutes())
        ->filter(fn (RoutingRoute $route): bool => str_starts_with($route->uri(), 'api/'))
        ->filter(fn (RoutingRoute $route): bool => in_array(
            Authenticate::class.':sanctum',
            Route::gatherRouteMiddleware($route),
            true,
        ))
        ->reject(fn (RoutingRoute $route): bool => in_array(
            RefuseAccessTokens::class,
            Route::gatherRouteMiddleware($route),
            true,
        ))
        ->map(fn (RoutingRoute $route): string => $route->uri())
        ->unique()
        ->sort()
        ->values()
        ->all();

    expect($open)->toBe(
        collect(TOKEN_API_ROUTES)->sort()->values()->all(),
        'An authenticated API route takes a personal access token. Open its file\'s '
        .'group with RefuseAccessTokens next to auth:sanctum, or — if a token genuinely '
        .'may call it — put it behind CheckAbilities and add it to TOKEN_API_ROUTES.',
    );
});

test('the routes open to a token are behind the invoices:read ability', function (): void {
    $unguarded = collect(Route::getRoutes()->getRoutes())
        ->filter(fn (RoutingRoute $route): bool => in_array($route->uri(), TOKEN_API_ROUTES, true))
        ->reject(fn (RoutingRoute $route): bool => in_array(
            RefuseAccessTokens::class,
            Route::gatherRouteMiddleware($route),
            true,
        ))
        ->reject(fn (RoutingRoute $route): bool => in_array(
            CheckAbilities::class.':'.TokenAbility::ReadInvoices->value,
            Route::gatherRouteMiddleware($route),
            true,
        ))
        ->map(fn (RoutingRoute $route): string => implode('|', $route->methods()).' '.$route->uri())
        ->values()
        ->all();

    expect($unguarded)->toBe([]);
});
