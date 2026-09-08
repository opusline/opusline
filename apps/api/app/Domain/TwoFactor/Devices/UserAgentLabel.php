<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Devices;

/**
 * The coarse browser and platform names a user recognises a session by. Not a
 * user-agent parser: five browsers, five platforms, null for anything else.
 */
final readonly class UserAgentLabel
{
    private const array BROWSERS = [
        'Edg/' => 'Edge',
        'OPR/' => 'Opera',
        'Firefox/' => 'Firefox',
        'Chrome/' => 'Chrome',
        'Safari/' => 'Safari',
    ];

    private const array PLATFORMS = [
        'Windows' => 'Windows',
        'Android' => 'Android',
        'iPhone' => 'iOS',
        'iPad' => 'iOS',
        'Macintosh' => 'macOS',
        'Linux' => 'Linux',
    ];

    public function __construct(
        public ?string $browser,
        public ?string $platform,
    ) {}

    public static function parse(?string $userAgent): self
    {
        if ($userAgent === null || $userAgent === '') {
            return new self(null, null);
        }

        return new self(
            self::firstMatch(self::BROWSERS, $userAgent),
            self::firstMatch(self::PLATFORMS, $userAgent),
        );
    }

    /**
     * Order matters: Chromium browsers all carry "Chrome/" and "Safari/", so
     * the more specific markers are listed first.
     *
     * @param  array<string, string>  $markers
     */
    private static function firstMatch(array $markers, string $userAgent): ?string
    {
        foreach ($markers as $marker => $label) {
            if (str_contains($userAgent, $marker)) {
                return $label;
            }
        }

        return null;
    }
}
