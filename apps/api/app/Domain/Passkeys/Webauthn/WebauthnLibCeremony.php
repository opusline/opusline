<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Webauthn;

use App\Domain\Passkeys\Models\Passkey;
use App\Domain\Users\Models\User;
use Cose\Algorithm\Manager;
use Cose\Algorithm\Signature\ECDSA\ES256;
use Cose\Algorithm\Signature\RSA\RS256;
use Cose\Algorithms;
use ParagonIE\ConstantTime\Base64UrlSafe;
use Symfony\Component\Serializer\Encoder\JsonEncode;
use Symfony\Component\Serializer\Normalizer\AbstractObjectNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Uid\NilUuid;
use Symfony\Component\Uid\Uuid;
use Throwable;
use Webauthn\AttestationStatement\AttestationStatementSupportManager;
use Webauthn\AttestationStatement\NoneAttestationStatementSupport;
use Webauthn\AuthenticatorAssertionResponse;
use Webauthn\AuthenticatorAssertionResponseValidator;
use Webauthn\AuthenticatorAttestationResponse;
use Webauthn\AuthenticatorAttestationResponseValidator;
use Webauthn\AuthenticatorSelectionCriteria;
use Webauthn\CeremonyStep\CeremonyStepManagerFactory;
use Webauthn\CredentialRecord;
use Webauthn\Denormalizer\WebauthnSerializerFactory;
use Webauthn\PublicKeyCredential;
use Webauthn\PublicKeyCredentialCreationOptions;
use Webauthn\PublicKeyCredentialDescriptor;
use Webauthn\PublicKeyCredentialParameters;
use Webauthn\PublicKeyCredentialRequestOptions;
use Webauthn\PublicKeyCredentialRpEntity;
use Webauthn\PublicKeyCredentialUserEntity;
use Webauthn\TrustPath\EmptyTrustPath;

/**
 * The only class that imports the library. Attestation is not asked for
 * ("none"): what a passkey proves here is possession, not the make of the
 * authenticator.
 */
final readonly class WebauthnLibCeremony implements PasskeyCeremony
{
    private const int TIMEOUT_MILLISECONDS = 60_000;

    public function __construct(private RelyingParty $relyingParty) {}

    public function creationOptions(User $user, string $userHandle, array $excludeCredentialIds): array
    {
        $options = PublicKeyCredentialCreationOptions::create(
            rp: PublicKeyCredentialRpEntity::create($this->relyingParty->name, $this->relyingParty->id),
            user: PublicKeyCredentialUserEntity::create($user->email, $userHandle, $user->name),
            challenge: random_bytes(32),
            pubKeyCredParams: [
                PublicKeyCredentialParameters::createPk(Algorithms::COSE_ALGORITHM_ES256),
                PublicKeyCredentialParameters::createPk(Algorithms::COSE_ALGORITHM_RS256),
            ],
            // A resident key is what makes the passkey usable without typing
            // an email first; user verification stays preferred so a plain
            // security key without PIN still enrols.
            authenticatorSelection: AuthenticatorSelectionCriteria::create(
                userVerification: AuthenticatorSelectionCriteria::USER_VERIFICATION_REQUIREMENT_PREFERRED,
                residentKey: AuthenticatorSelectionCriteria::RESIDENT_KEY_REQUIREMENT_REQUIRED,
            ),
            attestation: PublicKeyCredentialCreationOptions::ATTESTATION_CONVEYANCE_PREFERENCE_NONE,
            excludeCredentials: array_map($this->descriptor(...), $excludeCredentialIds),
            timeout: self::TIMEOUT_MILLISECONDS,
        );

        return $this->toArray($options);
    }

    public function verifyRegistration(array $credential, array $options): VerifiedRegistration
    {
        try {
            $serializer = $this->serializer();
            $response = $this->deserialize($serializer, $credential)->response;

            if (! $response instanceof AuthenticatorAttestationResponse) {
                throw new PasskeyVerificationFailed('Not a registration response.');
            }

            $creationOptions = $serializer->deserialize(
                json_encode($options, JSON_THROW_ON_ERROR),
                PublicKeyCredentialCreationOptions::class,
                'json',
            );

            $record = AuthenticatorAttestationResponseValidator::create($this->steps()->creationCeremony())
                ->check($response, $creationOptions, $this->relyingParty->id);
        } catch (PasskeyVerificationFailed $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            throw new PasskeyVerificationFailed($exception->getMessage(), $exception->getCode(), previous: $exception);
        }

        return new VerifiedRegistration(
            credentialId: Base64UrlSafe::encodeUnpadded($record->publicKeyCredentialId),
            publicKey: base64_encode($record->credentialPublicKey),
            counter: $record->counter,
            transports: array_values(array_filter($record->transports, is_string(...))),
            aaguid: $record->aaguid instanceof NilUuid ? null : $record->aaguid->toRfc4122(),
            backupEligible: $record->backupEligible ?? false,
            backedUp: $record->backupStatus ?? false,
        );
    }

    public function requestOptions(array $allowCredentialIds, bool $requireUserVerification): array
    {
        $options = PublicKeyCredentialRequestOptions::create(
            challenge: random_bytes(32),
            rpId: $this->relyingParty->id,
            allowCredentials: array_map($this->descriptor(...), $allowCredentialIds),
            userVerification: $requireUserVerification
                ? PublicKeyCredentialRequestOptions::USER_VERIFICATION_REQUIREMENT_REQUIRED
                : PublicKeyCredentialRequestOptions::USER_VERIFICATION_REQUIREMENT_PREFERRED,
            timeout: self::TIMEOUT_MILLISECONDS,
        );

        return $this->toArray($options);
    }

    public function verifyAssertion(array $credential, array $options, Passkey $passkey, string $expectedUserHandle): int
    {
        try {
            $serializer = $this->serializer();
            $response = $this->deserialize($serializer, $credential)->response;

            if (! $response instanceof AuthenticatorAssertionResponse) {
                throw new PasskeyVerificationFailed('Not an assertion response.');
            }

            $requestOptions = $serializer->deserialize(
                json_encode($options, JSON_THROW_ON_ERROR),
                PublicKeyCredentialRequestOptions::class,
                'json',
            );

            $record = CredentialRecord::create(
                publicKeyCredentialId: Base64UrlSafe::decodeNoPadding($passkey->credential_id),
                type: PublicKeyCredentialDescriptor::CREDENTIAL_TYPE_PUBLIC_KEY,
                transports: $passkey->transports ?? [],
                attestationType: 'none',
                trustPath: EmptyTrustPath::create(),
                aaguid: $passkey->aaguid === null ? new NilUuid : Uuid::fromString($passkey->aaguid),
                credentialPublicKey: (string) base64_decode($passkey->public_key, true),
                userHandle: $expectedUserHandle,
                counter: $passkey->counter,
                backupEligible: $passkey->backup_eligible,
                backupStatus: $passkey->backed_up,
            );

            $updated = AuthenticatorAssertionResponseValidator::create($this->steps()->requestCeremony())
                ->check($record, $response, $requestOptions, $this->relyingParty->id, $response->userHandle);
        } catch (PasskeyVerificationFailed $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            throw new PasskeyVerificationFailed($exception->getMessage(), $exception->getCode(), previous: $exception);
        }

        return $updated->counter;
    }

    private function steps(): CeremonyStepManagerFactory
    {
        $factory = new CeremonyStepManagerFactory;
        $factory->setAllowedOrigins($this->relyingParty->origins);
        $factory->setAttestationStatementSupportManager($this->attestationSupport());
        $factory->setAlgorithmManager(Manager::create()->add(ES256::create(), RS256::create()));

        if ($this->relyingParty->allowsInsecureOrigins()) {
            // Deprecated in 5.2 but still the library's only way to accept an
            // http origin (CheckOrigin insists on https otherwise); the relying
            // party only reports one outside production.
            $factory->setSecuredRelyingPartyId([$this->relyingParty->id]);
        }

        return $factory;
    }

    private function attestationSupport(): AttestationStatementSupportManager
    {
        return AttestationStatementSupportManager::create([NoneAttestationStatementSupport::create()]);
    }

    private function serializer(): SerializerInterface
    {
        return new WebauthnSerializerFactory($this->attestationSupport())->create();
    }

    /**
     * @param  array<string, mixed>  $credential
     */
    private function deserialize(SerializerInterface $serializer, array $credential): PublicKeyCredential
    {
        return $serializer->deserialize(
            json_encode($credential, JSON_THROW_ON_ERROR),
            PublicKeyCredential::class,
            'json',
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function toArray(PublicKeyCredentialCreationOptions|PublicKeyCredentialRequestOptions $options): array
    {
        $json = $this->serializer()->serialize($options, 'json', [
            AbstractObjectNormalizer::SKIP_NULL_VALUES => true,
            JsonEncode::OPTIONS => JSON_THROW_ON_ERROR,
        ]);

        $decoded = json_decode($json, true, flags: JSON_THROW_ON_ERROR);

        return is_array($decoded) ? array_filter($decoded, is_string(...), ARRAY_FILTER_USE_KEY) : [];
    }

    private function descriptor(string $credentialId): PublicKeyCredentialDescriptor
    {
        return PublicKeyCredentialDescriptor::create(
            PublicKeyCredentialDescriptor::CREDENTIAL_TYPE_PUBLIC_KEY,
            Base64UrlSafe::decodeNoPadding($credentialId),
        );
    }
}
