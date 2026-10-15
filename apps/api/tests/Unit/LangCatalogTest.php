<?php

declare(strict_types=1);

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\DataConfig;
use Tests\TestCase;

uses(TestCase::class);

/**
 * @return array<string, list<string>>
 */
function langCatalogKeys(string $locale): array
{
    $groups = [];

    foreach (glob(dirname(__DIR__, 2)."/lang/{$locale}/*.php") ?: [] as $file) {
        $keys = array_keys(Arr::dot(include $file));
        sort($keys);

        $groups[basename($file, '.php')] = $keys;
    }

    return $groups;
}

/**
 * Property names of every Data class a route validates a request into: the
 * ones its actions inject, and every Data nested in those. Read off the routes
 * the way SpatieDataParametersExtractor builds the spec, so a response class
 * never needs listing and a new request class can never be missed.
 *
 * @return list<string>
 */
function requestDataFields(): array
{
    $dataConfig = app(DataConfig::class);
    $pending = [];

    foreach (Route::getRoutes()->getRoutes() as $route) {
        foreach ($route->signatureParameters() as $parameter) {
            $type = $parameter->getType();

            if ($type instanceof ReflectionNamedType && is_a($type->getName(), Data::class, true)) {
                $pending[] = $type->getName();
            }
        }
    }

    $visited = [];
    $fields = [];

    while ($pending !== []) {
        $class = array_pop($pending);

        if (isset($visited[$class])) {
            continue;
        }

        $visited[$class] = true;

        foreach ($dataConfig->getDataClass($class)->properties as $property) {
            $fields[$property->name] = true;

            if ($property->type->dataClass !== null) {
                $pending[] = $property->type->dataClass;
            }
        }
    }

    return array_keys($fields);
}

test('every lang group carries the same keys in French and English', function (): void {
    expect(langCatalogKeys('fr'))->toBe(langCatalogKeys('en'));
});

test('every validated request field has a display name in both locales', function (string $locale): void {
    $fields = include dirname(__DIR__, 2)."/lang/{$locale}/fields.php";
    $stockAttributes = (include dirname(__DIR__, 2)."/lang/{$locale}/validation.php")['attributes'];

    $missing = array_values(array_filter(
        requestDataFields(),
        fn (string $field): bool => ! isset($fields[$field]) && ! isset($stockAttributes[Str::snake($field)]),
    ));

    expect($missing)->toBe([]);
})->with(['fr', 'en']);
