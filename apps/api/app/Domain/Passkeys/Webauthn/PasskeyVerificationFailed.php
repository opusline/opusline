<?php

declare(strict_types=1);

namespace App\Domain\Passkeys\Webauthn;

use RuntimeException;

final class PasskeyVerificationFailed extends RuntimeException {}
