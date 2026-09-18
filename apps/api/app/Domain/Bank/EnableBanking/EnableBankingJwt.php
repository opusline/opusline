<?php

declare(strict_types=1);

namespace App\Domain\Bank\EnableBanking;

use App\Domain\Bank\Enums\BankSyncError;
use Carbon\CarbonImmutable;
use ParagonIE\ConstantTime\Base64UrlSafe;

/**
 * The bearer token of every Enable Banking call: an RS256 JWT signed with the
 * application's own private key, whose id travels as `kid`. Signed with
 * ext-openssl directly — the format is three base64url segments, which does
 * not earn a JWT library.
 *
 * @see https://enablebanking.com/docs/api/reference/
 */
final class EnableBankingJwt
{
    /** Enable Banking refuses tokens living longer than a day; an hour is plenty for one request. */
    private const int TTL_SECONDS = 3600;

    public static function sign(EnableBankingCredentials $credentials, CarbonImmutable $issuedAt): string
    {
        $header = ['typ' => 'JWT', 'alg' => 'RS256', 'kid' => $credentials->applicationId];
        $claims = [
            'iss' => 'enablebanking.com',
            'aud' => 'api.enablebanking.com',
            'iat' => $issuedAt->getTimestamp(),
            'exp' => $issuedAt->getTimestamp() + self::TTL_SECONDS,
        ];

        $signingInput = self::segment($header).'.'.self::segment($claims);
        $signature = '';

        // Opened first because openssl_sign() warns on a bad key instead of
        // failing quietly. Keys are validated when saved, so only a
        // hand-edited row lands here.
        $key = openssl_pkey_get_private($credentials->privateKey);

        if ($key === false || ! openssl_sign($signingInput, $signature, $key, OPENSSL_ALGO_SHA256) || ! is_string($signature)) {
            throw new BankSyncFailed(BankSyncError::CredentialsRejected, 'The Enable Banking private key cannot sign.');
        }

        return $signingInput.'.'.Base64UrlSafe::encodeUnpadded($signature);
    }

    /**
     * @param  array<string, int|string>  $payload
     */
    private static function segment(array $payload): string
    {
        return Base64UrlSafe::encodeUnpadded(json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));
    }
}
