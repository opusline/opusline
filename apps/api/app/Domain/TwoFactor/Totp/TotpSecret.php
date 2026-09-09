<?php

declare(strict_types=1);

namespace App\Domain\TwoFactor\Totp;

use Carbon\FactoryImmutable;
use InvalidArgumentException;
use OTPHP\TOTP;

final class TotpSecret
{
    /**
     * 160 bits, SHA-1, six digits, 30-second steps: the one profile every
     * authenticator app agrees on. otphp's defaults cover all but the secret
     * length, whose default is longer than some apps accept by hand.
     */
    public static function mint(): string
    {
        return TOTP::generate(FactoryImmutable::getDefaultInstance(), secretSize: 20)->getSecret();
    }

    /**
     * Carbon's default factory is where travelTo() parks the test clock, so a
     * frozen test moves the TOTP window the same way it moves now().
     */
    public static function totp(string $secret): TOTP
    {
        return TOTP::createFromSecret(self::nonEmpty($secret, 'secret'), FactoryImmutable::getDefaultInstance());
    }

    public static function provisioningUri(string $secret, string $accountLabel): string
    {
        $totp = self::totp($secret);
        $totp->setLabel(self::nonEmpty($accountLabel, 'account label'));
        $totp->setIssuer(self::nonEmpty(config()->string('app.name'), 'issuer'));

        return $totp->getProvisioningUri();
    }

    /**
     * @return non-empty-string
     */
    private static function nonEmpty(string $value, string $role): string
    {
        return $value !== '' ? $value : throw new InvalidArgumentException("The TOTP {$role} cannot be empty.");
    }
}
