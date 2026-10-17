<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/** Who gets the document and with what words; the words default to the template. */
class SendDocumentEmailData extends Data
{
    /**
     * @param  list<string>  $recipients
     */
    public function __construct(
        #[Min(1), Max(10)]
        public array $recipients,
        /** A copy to the account's own sign-in address. */
        public bool $copyToSender = false,
        #[Min(1), Max(255)]
        public ?string $subject = null,
        #[Min(1), Max(5000)]
        public ?string $body = null,
    ) {}

    /**
     * Each recipient is a plain address: anything else is refused before it
     * can reach a header.
     *
     * @return array<string, list<object|string>>
     */
    public static function rules(): array
    {
        return [
            'recipients.*' => ['string', 'email:rfc,strict', 'max:254', 'distinct:ignore_case'],
        ];
    }
}
