<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Data;

/** A client e-mail rendered with sample figures, as the client would read it. */
class EmailPreviewData extends Data
{
    public function __construct(
        public string $subject,
        /** The body as plain text, placeholders filled. */
        public string $text,
        /** The whole e-mail as HTML, the way the mailer sends it. */
        public string $html,
    ) {}
}
