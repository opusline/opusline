<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Webauthn;

/**
 * Who the passkeys are for, derived from the app URL unless config/passkeys.php
 * says otherwise. The id is the bare host; the origins are every scheme+host
 * the SPA can be loaded from.
 */
final readonly class RelyingParty
{
    /**
     * @param  list<string>  $origins
     */
    public function __construct(
        public string $id,
        public string $name,
        public array $origins,
    ) {}

    public static function fromConfig(): self
    {
        $appUrl = config()->string('app.url');
        $scheme = parse_url($appUrl, PHP_URL_SCHEME);
        $scheme = is_string($scheme) ? $scheme : 'https';
        $appHost = parse_url($appUrl, PHP_URL_HOST);
        $appHost = is_string($appHost) ? $appHost : 'localhost';

        $configuredId = config('passkeys.rp_id');
        $configuredOrigins = config('passkeys.origins');

        if (is_string($configuredOrigins) && $configuredOrigins !== '') {
            $origins = array_map(trim(...), explode(',', $configuredOrigins));
        } else {
            $stateful = config('sanctum.stateful');
            $statefulOrigins = array_map(
                fn (string $domain): string => "{$scheme}://".self::bracketed(trim($domain)),
                is_array($stateful) ? array_filter($stateful, is_string(...)) : [],
            );
            $origins = [self::origin($appUrl), ...$statefulOrigins];
        }

        // Plain http is a development allowance (see allowsInsecureOrigins);
        // a production instance never lists one, whatever the config says.
        if (app()->isProduction()) {
            $origins = array_filter($origins, fn (string $origin): bool => ! str_starts_with($origin, 'http://'));
        }

        return new self(
            id: is_string($configuredId) && $configuredId !== '' ? $configuredId : $appHost,
            name: config()->string('app.name'),
            origins: array_values(array_unique(array_filter($origins, fn (string $origin): bool => $origin !== ''))),
        );
    }

    /** Browsers only offer WebAuthn on https or localhost, so http is a dev-only allowance. */
    public function allowsInsecureOrigins(): bool
    {
        return array_any($this->origins, fn (string $origin): bool => str_starts_with($origin, 'http://'));
    }

    /** A bare IPv6 literal such as Sanctum's default `::1` needs brackets in an origin. */
    private static function bracketed(string $host): string
    {
        return substr_count($host, ':') >= 2 && ! str_starts_with($host, '[') ? "[{$host}]" : $host;
    }

    private static function origin(string $url): string
    {
        $parts = parse_url($url);

        if (! is_array($parts) || ! isset($parts['scheme'], $parts['host'])) {
            return '';
        }

        return $parts['scheme'].'://'.$parts['host'].(isset($parts['port']) ? ':'.$parts['port'] : '');
    }
}
