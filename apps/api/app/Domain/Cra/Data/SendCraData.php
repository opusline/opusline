<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use App\Domain\Shared\Validation\BeforeOrEqualAccountToday;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;

class SendCraData extends Data
{
    public function __construct(
        /** Whether to stamp the saved signature onto the document. */
        #[BooleanType]
        public bool $applySignature = false,
        /** Defaults to today; back-dating is allowed, post-dating is not. */
        #[DateFormat('Y-m-d'), Rule(new BeforeOrEqualAccountToday)]
        public ?string $sentOn = null,
    ) {}
}
