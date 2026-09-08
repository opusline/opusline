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
