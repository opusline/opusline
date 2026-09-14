<?php

declare(strict_types=1);

use App\Domain\Shared\Routing\OwnedRouteBinding;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Route;

/**
 * The other half of the authorization model.
 *
 * RouteAuthenticationTest asserts every route is behind the guard; being signed
 * in is only half of it. With no policy layer, what keeps one account off
 * another's rows is that each bound model overrides `resolveRouteBinding` to
 * look the id up through the authenticated user's own relation. That is a
 * one-method-per-model convention, and a new route whose model forgets it is a
 * silent cross-tenant read with the whole suite green.
 */

/**
 * Route parameters that name something other than a row of the account's, and
 * the reason each one is safe without an owner-scoped binding.
 */
const SCALAR_ROUTE_PARAMETERS = [
    // A media id, deliberately typed `int` so no implicit binding happens.
    // Media is a package model and cannot carry the override, so the three
    // document controllers re-scope it themselves — ClientDocumentController's
    // documentOf() asks `$client->documents()`, and its mission and user
    // counterparts do the same — through a relation of a parent this test has
    // already proved owner-scoped.
    'document',
    // An int-backed FiscalDeadlineKind, constrained by whereNumber: an enum
    // case, identical for every account and owned by none.
    'kind',
    // The period a return covers — `2026-07`, `2026-Q3`, `2026` — constrained
    // by CompleteFiscalDeadlineData::PERIOD_KEY_EXPRESSION.
    'periodKey',
    // The calendar feed's credential rather than an id: the route is public on
    // purpose and DeadlineCalendarController resolves the account *from* it.
    'token',
];

/** The model class a route parameter binds, or null when it binds a scalar. */
function routeBoundModel(RoutingRoute $route, string $parameter): ?string
{
    foreach ($route->signatureParameters() as $signature) {
        if ($signature->getName() !== $parameter) {
            continue;
        }

        $type = $signature->getType();

        if (! $type instanceof ReflectionNamedType || $type->isBuiltin()) {
            return null;
        }

        return is_subclass_of($type->getName(), Model::class) ? $type->getName() : null;
    }

    return null;
}

/** Whether the model resolves its own bindings rather than inheriting Eloquent's. */
function resolvesBindingThroughOwner(string $model): bool
{
    return new ReflectionMethod($model, 'resolveRouteBinding')->getDeclaringClass()->getName() === $model;
}

test('every model a route parameter binds is resolved through the owning account', function (): void {
    $unguarded = [];
    $scalars = [];

    foreach (Route::getRoutes()->getRoutes() as $route) {
        if (! str_starts_with($route->uri(), 'api/')) {
            continue;
        }

        $parent = null;

        foreach ($route->parameterNames() as $parameter) {
            $model = routeBoundModel($route, $parameter);

            if ($model === null) {
                $scalars[] = $parameter;

                continue;
            }

            // Under scopeBindings() the child is resolved through the parent's
            // relation, so the parent's own override owns both rows.
            $guarded = resolvesBindingThroughOwner($model)
                || ($route->enforcesScopedBindings() && $parent !== null && resolvesBindingThroughOwner($parent));
            $parent = $model;

            if (! $guarded) {
                $unguarded[] = $route->uri().' {'.$parameter.'}: '.$model;
            }
        }
    }

    sort($unguarded);

    expect($unguarded)->toBe(
        [],
        'These routes bind a model that resolves ids globally, so any signed-in '
        .'account can read another\'s row by id. Override resolveRouteBinding() '
        .'on the model through '.OwnedRouteBinding::class.', or put the route in '
        .'a scopeBindings() group under a parent that does.',
    );

    $scalars = array_values(array_unique($scalars));
    sort($scalars);

    expect($scalars)->toBe(
        collect(SCALAR_ROUTE_PARAMETERS)->sort()->values()->all(),
        'A route parameter binds no model, so nothing scopes it to the account. '
        .'Type-hint the owning model in the controller, or — if it genuinely is '
        .'not a row of the account\'s — add it to SCALAR_ROUTE_PARAMETERS with '
        .'the reason it is safe.',
    );
});
