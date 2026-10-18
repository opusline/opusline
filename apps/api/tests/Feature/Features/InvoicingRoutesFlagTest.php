<?php

declare(strict_types=1);

use App\Http\Features\Support\EnsureFeatureIsActive;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Route;

/*
 * FeatureFlagsTest walks a sample of the invoicing routes with the flag off.
 * This one holds the rule for every route under /api/invoicing, so a new one
 * cannot ship outside the flag with the suite green.
 */
test('every invoicing route sits behind the invoicing flag', function (): void {
    $invoicingRoutes = collect(Route::getRoutes()->getRoutes())
        ->filter(static fn (RoutingRoute $route): bool => str_starts_with($route->uri(), 'api/invoicing/') || $route->uri() === 'api/invoicing');

    $unflagged = $invoicingRoutes
        ->reject(static fn (RoutingRoute $route): bool => in_array(EnsureFeatureIsActive::class.':invoicing', $route->gatherMiddleware(), true))
        ->map(static fn (RoutingRoute $route): string => implode('|', $route->methods()).' '.$route->uri())
        ->values()
        ->all();

    expect($invoicingRoutes)->not->toBeEmpty()
        ->and($unflagged)->toBe([]);
});
