<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Data;

class EmailTemplatesData extends Data
{
    /**
     * @param  list<EmailTemplateData>  $templates  One per kind, in the enum's order.
     */
    public function __construct(
        public array $templates,
        /** What the payment-reminder template's automation starts from on a new invoice. */
        public ReminderDefaultsData $reminderDefaults,
    ) {}
}
