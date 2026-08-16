<?php

declare(strict_types=1);

namespace App\Domain\Bank\Parsing;

use RuntimeException;

/**
 * A statement file the user handed us could not be understood. The exception
 * message is a `bank.*` translation key; the import boundary passes it through
 * __() to build the 422 response.
 */
class StatementParseException extends RuntimeException {}
