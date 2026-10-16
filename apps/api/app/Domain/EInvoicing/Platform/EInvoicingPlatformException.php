<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Platform;

use RuntimeException;

/** The platform refused or could not complete a call: the message is what the user reads. */
class EInvoicingPlatformException extends RuntimeException {}
