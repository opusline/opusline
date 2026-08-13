<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Data;

class DownloadCraPdfData extends Data
{
    public function __construct(
        /**
         * Whether to stamp the saved signature on. Only consulted while the CRA is a draft
         * and the document is rendered on the fly — an issued one streams the file that
         * was actually sent, signature and all.
         */
        #[BooleanType]
        public bool $applySignature = false,
    ) {}

    /**
     * A query string can only carry text, and both the generated client and a hand-typed
     * URL spell a boolean "true"/"false" — which Laravel's boolean rule rejects, since it
     * accepts only 1/0. Normalised here, before validation, rather than making every
     * caller know to send a 1.
     *
     * Anything that is not a recognised spelling is passed through untouched so the rule
     * still rejects it: "?applySignature=banana" is an error, not a false.
     *
     * @param  array<string, mixed>  $properties
     * @return array<string, mixed>
     */
    #[\Override]
    public static function prepareForPipeline(array $properties): array
    {
        $given = $properties['applySignature'] ?? null;

        if (is_string($given)) {
            $properties['applySignature'] = filter_var($given, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? $given;
        }

        return $properties;
    }
}
