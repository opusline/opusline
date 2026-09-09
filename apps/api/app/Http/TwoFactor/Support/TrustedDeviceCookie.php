<?php

declare(strict_types=1);

namespace App\Http\TwoFactor\Support;

use App\Domain\TwoFactor\Models\TrustedDevice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Cookie as HttpCookie;

/**
 * Not in the encryptCookies() exception list on purpose: the token travels
 * encrypted and signed, and only its hash is stored.
 */
class TrustedDeviceCookie
{
    public const string NAME = 'opusline_trusted_device';

    private const int LIFETIME_MINUTES = 60 * 24 * TrustedDevice::LIFETIME_DAYS;

    public static function for(string $token): HttpCookie
    {
        return Cookie::make(
            name: self::NAME,
            value: $token,
            minutes: self::LIFETIME_MINUTES,
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
        );
    }

    public static function forget(): HttpCookie
    {
        return Cookie::forget(self::NAME, '/');
    }

    public static function tokenFrom(Request $request): ?string
    {
        $token = $request->cookie(self::NAME);

        return is_string($token) && $token !== '' ? $token : null;
    }
}
