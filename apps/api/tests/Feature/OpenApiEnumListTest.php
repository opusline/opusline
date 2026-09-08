<?php

declare(strict_types=1);

use Dedoc\Scramble\Generator;

/**
 * A `list<SomeEnum>` docblock is the only declaration of an array property's
 * item type, and the enum is named the way the file imports it. The spec must
 * carry the enum reference, or the client sees `unknown[]` and the SPA cannot
 * narrow the challenge methods.
 */
test('an enum list declared in a docblock reaches the spec as a reference', function (): void {
    $spec = app(Generator::class)();

    expect($spec['components']['schemas']['TwoFactorChallengeData']['properties']['methods'])
        ->toBe(['type' => 'array', 'items' => ['$ref' => '#/components/schemas/TwoFactorMethod']])
        ->and($spec['components']['schemas']['TwoFactorMethod']['x-enum-varnames'])
        ->toContain('Totp');
});
