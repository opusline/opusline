<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\ReminderFrequency;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/** An invoice's send also settles its automatic reminders; left out, they follow the account's defaults. */
class SendInvoiceEmailData extends Data
{
    /**
     * @param  list<string>  $recipients
     */
    public function __construct(
        #[Min(1), Max(10)]
        public array $recipients,
        public bool $copyToSender = false,
        #[Min(1), Max(255)]
        public ?string $subject = null,
        #[Min(1), Max(5000)]
        public ?string $body = null,
        public ?bool $remindersEnabled = null,
        #[Enum(ReminderFrequency::class)]
        public ?ReminderFrequency $remindersFrequency = null,
    ) {}

    /**
     * @return array<string, list<object|string>>
     */
    public static function rules(): array
    {
        return SendDocumentEmailData::rules();
    }
}
