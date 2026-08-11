<?php

declare(strict_types=1);

namespace App\Http\Users\Support;

use App\Domain\Users\Enums\Theme;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Cookie as HttpCookie;

class ThemeCookie
{
    public const string NAME = 'opusline_theme';

    private const int LIFETIME_MINUTES = 60 * 24 * 365;

    public static function for(Theme $theme): HttpCookie
    {
        return Cookie::make(
            name: self::NAME,
            value: self::value($theme),
            minutes: self::LIFETIME_MINUTES,
            path: '/',
            httpOnly: false,
            sameSite: 'lax',
        );
    }

    public static function forget(): HttpCookie
    {
        return Cookie::forget(self::NAME, '/');
    }

    private static function value(Theme $theme): string
    {
        return match ($theme) {
            Theme::System => 'system',
            Theme::Light => 'light',
            Theme::Dark => 'dark',
        };
    }
}
