<?php

declare(strict_types=1);

use Illuminate\Support\Arr;
use Illuminate\Support\Str;

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
 * Constructor property names of every request-bound Data class — the ones
 * validation runs against, recognized by their imperative class names.
 *
 * @return list<string>
 */
function requestDataFields(): array
{
    $fields = [];

    foreach (glob(dirname(__DIR__, 2).'/app/Domain/*/Data/*.php') ?: [] as $path) {
        $class = basename($path, '.php');

        if (preg_match('/^(Create|Update|Upload|List|Pay|Remind|Send|Download|Summarize|Start|Stop|Trim|Register|Login)|InputData$/', $class) !== 1) {
            continue;
        }

        $fqcn = 'App\\Domain\\'.basename(dirname($path, 2)).'\\Data\\'.$class;

        foreach ((new ReflectionClass($fqcn))->getConstructor()?->getParameters() ?? [] as $parameter) {
            $fields[$parameter->getName()] = true;
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
