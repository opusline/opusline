<?php

declare(strict_types=1);

namespace Tests\Support;

use CBOR\ByteStringObject;
use CBOR\MapObject;
use CBOR\NegativeIntegerObject;
use CBOR\TextStringObject;
use CBOR\UnsignedIntegerObject;
use OpenSSLAsymmetricKey;
use ParagonIE\ConstantTime\Base64UrlSafe;
use RuntimeException;

/**
 * A minimal ES256 authenticator: enough of the WebAuthn wire format to
 * register and assert against the real library, with "none" attestation.
 */
final readonly class PasskeyAuthenticatorSimulator
{
    private const int FLAG_USER_PRESENT = 0b00000001;

    private const int FLAG_USER_VERIFIED = 0b00000100;

    private const int FLAG_ATTESTED_DATA = 0b01000000;

    private OpenSSLAsymmetricKey $key;

    public string $credentialId;

    public function __construct(
        private string $relyingPartyId,
        private string $origin,
        ?OpenSSLAsymmetricKey $key = null,
        ?string $credentialId = null,
    ) {
        $this->key = $key ?? openssl_pkey_new(['curve_name' => 'prime256v1', 'private_key_type' => OPENSSL_KEYTYPE_EC])
            ?: throw new RuntimeException('Could not generate a P-256 key.');
        $this->credentialId = $credentialId ?? random_bytes(32);
    }

    /**
     * The same credential answering from somewhere else: the signature stays
     * valid, so only the origin or relying party can be what gets refused.
     */
    public function claiming(string $origin, string $relyingPartyId): self
    {
        return new self($relyingPartyId, $origin, $this->key, $this->credentialId);
    }

    public function encodedCredentialId(): string
    {
        return Base64UrlSafe::encodeUnpadded($this->credentialId);
    }

    /**
     * @param  array<string, mixed>  $options
     * @return array<string, mixed>
     */
    public function register(array $options): array
    {
        $clientDataJson = $this->clientDataJson('webauthn.create', $options);
        $attestationObject = MapObject::create()
            ->add(TextStringObject::create('fmt'), TextStringObject::create('none'))
            ->add(TextStringObject::create('attStmt'), MapObject::create())
            ->add(TextStringObject::create('authData'), ByteStringObject::create($this->authenticatorData(
                self::FLAG_USER_PRESENT | self::FLAG_USER_VERIFIED | self::FLAG_ATTESTED_DATA,
                counter: 0,
                attested: true,
            )));

        return [
            'id' => $this->encodedCredentialId(),
            'rawId' => $this->encodedCredentialId(),
            'type' => 'public-key',
            'response' => [
                'clientDataJSON' => Base64UrlSafe::encodeUnpadded($clientDataJson),
                'attestationObject' => Base64UrlSafe::encodeUnpadded((string) $attestationObject),
                'transports' => ['internal'],
            ],
            'clientExtensionResults' => [],
        ];
    }

    /**
     * @param  array<string, mixed>  $options
     * @return array<string, mixed>
     */
    public function assert(array $options, int $counter, ?string $userHandle, bool $userVerified = true): array
    {
        $clientDataJson = $this->clientDataJson('webauthn.get', $options);
        $authenticatorData = $this->authenticatorData(
            self::FLAG_USER_PRESENT | ($userVerified ? self::FLAG_USER_VERIFIED : 0),
            $counter,
            attested: false,
        );

        if (! openssl_sign($authenticatorData.hash('sha256', $clientDataJson, true), $signature, $this->key, OPENSSL_ALGO_SHA256)) {
            throw new RuntimeException('Could not sign the assertion.');
        }

        return [
            'id' => $this->encodedCredentialId(),
            'rawId' => $this->encodedCredentialId(),
            'type' => 'public-key',
            'response' => [
                'clientDataJSON' => Base64UrlSafe::encodeUnpadded($clientDataJson),
                'authenticatorData' => Base64UrlSafe::encodeUnpadded($authenticatorData),
                'signature' => Base64UrlSafe::encodeUnpadded($signature),
                'userHandle' => $userHandle === null ? null : Base64UrlSafe::encodeUnpadded($userHandle),
            ],
            'clientExtensionResults' => [],
        ];
    }

    /**
     * @param  array<string, mixed>  $options
     */
    private function clientDataJson(string $type, array $options): string
    {
        return json_encode([
            'type' => $type,
            'challenge' => $options['challenge'],
            'origin' => $this->origin,
            'crossOrigin' => false,
        ], JSON_THROW_ON_ERROR);
    }

    private function authenticatorData(int $flags, int $counter, bool $attested): string
    {
        $data = hash('sha256', $this->relyingPartyId, true).chr($flags).pack('N', $counter);

        if (! $attested) {
            return $data;
        }

        $aaguid = str_repeat("\0", 16);

        return $data.$aaguid.pack('n', strlen($this->credentialId)).$this->credentialId.$this->cosePublicKey();
    }

    private function cosePublicKey(): string
    {
        $details = openssl_pkey_get_details($this->key);
        $x = $details['ec']['x'] ?? throw new RuntimeException('No EC point.');
        $y = $details['ec']['y'] ?? throw new RuntimeException('No EC point.');

        return (string) MapObject::create()
            ->add(UnsignedIntegerObject::create(1), UnsignedIntegerObject::create(2))
            ->add(UnsignedIntegerObject::create(3), NegativeIntegerObject::create(-7))
            ->add(NegativeIntegerObject::create(-1), UnsignedIntegerObject::create(1))
            ->add(NegativeIntegerObject::create(-2), ByteStringObject::create(str_pad($x, 32, "\0", STR_PAD_LEFT)))
            ->add(NegativeIntegerObject::create(-3), ByteStringObject::create(str_pad($y, 32, "\0", STR_PAD_LEFT)));
    }
}
