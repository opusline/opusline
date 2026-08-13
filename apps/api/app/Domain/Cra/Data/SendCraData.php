<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use Spatie\LaravelData\Attributes\Validation\BeforeOrEqual;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Data;

class SendCraData extends Data
{
    public function __construct(
        /** Whether to stamp the saved signature onto the document. */
        #[BooleanType]
        public bool $applySignature = false,
        /** Defaults to today; back-dating is allowed, post-dating is not. */
        #[DateFormat('Y-m-d'), BeforeOrEqual('today')]
        public ?string $sentOn = null,
    ) {}
}
