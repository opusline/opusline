<?php

declare(strict_types=1);

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

/**
 * Each path package under packages/, with everything it may use beyond PHP itself:
 * the classes its own composer.json `require` provides. Anything else — the app,
 * Laravel, a helper, a vendor library the package never declared — fails its fence.
 */
$packageDependencies = [
    'Opusline\BusinessCalendar' => [CarbonImmutable::class],
];

arch()->preset()->php();

arch('the domain layer is independent of the http delivery layer')
    ->expect('App\Domain')
    ->not->toUse('App\Http');

arch('the http layer reaches the database only through domain actions')
    ->expect('App\Http')
    ->not->toUse(DB::class);

test('fences every path package', function () use ($packageDependencies): void {
    $packageNamespaces = array_map(
        static function (string $manifest): string {
            /** @var array{autoload: array{psr-4: array<string, string>}} $package */
            $package = json_decode((string) file_get_contents($manifest), true, flags: JSON_THROW_ON_ERROR);

            return rtrim((string) array_key_first($package['autoload']['psr-4']), '\\');
        },
        glob(dirname(__DIR__, 2).'/packages/*/composer.json') ?: [],
    );

    expect(array_keys($packageDependencies))->toEqualCanonicalizing($packageNamespaces);
});

foreach ($packageDependencies as $namespace => $dependencies) {
    arch("{$namespace} uses only what its composer.json requires")
        ->expect($namespace)
        ->toOnlyUse($dependencies);
}

arch('all application code declares strict types')
    ->expect(['App', ...array_keys($packageDependencies)])
    ->toUseStrictTypes();
