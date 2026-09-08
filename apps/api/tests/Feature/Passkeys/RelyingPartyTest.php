<?php

declare(strict_types=1);

use App\Domain\Passkeys\Webauthn\RelyingParty;

test('a standard install derives everything from the app url and the stateful domains', function (): void {
    config()->set('app.url', 'https://opusline.example.com');
    config()->set('app.name', 'Opusline');
    config()->set('sanctum.stateful', ['opusline.example.com']);
    config()->set('passkeys.rp_id');
    config()->set('passkeys.origins');

    $relyingParty = RelyingParty::fromConfig();

    expect($relyingParty->id)->toBe('opusline.example.com')
        ->and($relyingParty->name)->toBe('Opusline')
        ->and($relyingParty->origins)->toBe(['https://opusline.example.com'])
        ->and($relyingParty->allowsInsecureOrigins())->toBeFalse();
});

test('development adds the vite origin and allows http', function (): void {
    config()->set('app.url', 'http://localhost');
    config()->set('sanctum.stateful', ['localhost:3000', 'localhost']);
    config()->set('passkeys.rp_id');
    config()->set('passkeys.origins');

    $relyingParty = RelyingParty::fromConfig();

    expect($relyingParty->id)->toBe('localhost')
        ->and($relyingParty->origins)->toBe(['http://localhost', 'http://localhost:3000'])
        ->and($relyingParty->allowsInsecureOrigins())->toBeTrue();
});

test('explicit config wins over the derivation', function (): void {
    config()->set('app.url', 'https://api.opusline.example.com');
    config()->set('passkeys.rp_id', 'opusline.example.com');
    config()->set('passkeys.origins', 'https://app.opusline.example.com, https://opusline.example.com');

    $relyingParty = RelyingParty::fromConfig();

    expect($relyingParty->id)->toBe('opusline.example.com')
        ->and($relyingParty->origins)->toBe(['https://app.opusline.example.com', 'https://opusline.example.com']);
});
