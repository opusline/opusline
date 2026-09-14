<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Webauthn;

/**
 * The browser's PublicKeyCredential travels as one JSON string: its shape
 * is the WebAuthn spec's, nested and open-ended, which the request schema
 * cannot spell out field by field.
 */
final class CredentialJson
{
    /**
     * The longest credential the boundary accepts. A real one is around a
     * kilobyte; two of the three routes carrying it answer without a session,
     * so the body is decoded twice before anything has been proven.
     */
    public const int MAX_LENGTH = 8192;

    /**
     * A non-object document decodes to nothing, and nothing verifies.
     *
     * @return array<string, mixed>
     */
    public static function decode(string $json): array
    {
        $decoded = json_decode($json, true);

        if (! is_array($decoded)) {
            return [];
        }

        return array_filter($decoded, is_string(...), ARRAY_FILTER_USE_KEY);
    }

    /**
     * The base64url id the browser reports, or null for a malformed answer.
     *
     * @param  array<string, mixed>  $credential
     */
    public static function id(array $credential): ?string
    {
        $id = $credential['id'] ?? null;

        return is_string($id) && $id !== '' ? $id : null;
    }
}
