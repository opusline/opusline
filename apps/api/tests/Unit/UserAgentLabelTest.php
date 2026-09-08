<?php

declare(strict_types=1);

use App\Domain\TwoFactor\Devices\UserAgentLabel;

test('names the browser and the platform a user recognises', function (?string $userAgent, ?string $browser, ?string $platform): void {
    $label = UserAgentLabel::parse($userAgent);

    expect($label->browser)->toBe($browser)
        ->and($label->platform)->toBe($platform);
})->with([
    'Chrome on macOS' => ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36', 'Chrome', 'macOS'],
    'Firefox on Linux' => ['Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0', 'Firefox', 'Linux'],
    'Safari on iOS' => ['Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1', 'Safari', 'iOS'],
    'Edge on Windows' => ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0', 'Edge', 'Windows'],
    'Chrome on Android' => ['Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36', 'Chrome', 'Android'],
    'Opera on Windows' => ['Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 OPR/114.0.0.0', 'Opera', 'Windows'],
    'unknown client' => ['curl/8.9.1', null, null],
    'no header' => [null, null, null],
]);
