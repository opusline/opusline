<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\InvoiceSource;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\ReminderFrequency;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class InvoiceData extends Data
{
    public function __construct(
        public int $id,
        public int $clientId,
        public ?int $missionId,
        public ?string $number,
        public InvoiceStatus $status,
        public InvoiceSource $source,
        public bool $isLate,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $issuedOn,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $dueOn,
        /** The day the payment that completed the invoice landed; null until it is paid. */
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $paidOn,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $periodStart,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $periodEnd,
        public MoneyData $amountHt,
        public MoneyData $amountVat,
        public MoneyData $amountTtc,
        /** What the client has paid so far: more than zero and less than the TTC is a partly paid invoice. */
        public MoneyData $amountPaid,
        /** What the client still owes. */
        public MoneyData $amountDue,
        public bool $ttcOverridden,
        public int $vatRateBp,
        public ?string $notes,
        public bool $remindersEnabled,
        public ReminderFrequency $remindersFrequency,
        /** @var list<string> */
        public array $reminderRecipients,
    ) {}

    public static function fromModel(Invoice $invoice): self
    {
        return new self(
            id: $invoice->id,
            clientId: $invoice->client_id,
            missionId: $invoice->mission_id,
            number: $invoice->number,
            status: $invoice->status,
            source: $invoice->source,
            isLate: $invoice->isLate(),
            issuedOn: $invoice->issued_on,
            dueOn: $invoice->due_on,
            paidOn: $invoice->paidOn(),
            periodStart: $invoice->period_start,
            periodEnd: $invoice->period_end,
            amountHt: MoneyData::fromMoney($invoice->amount_ht_cents),
            amountVat: MoneyData::fromMoney($invoice->vatAmount()),
            amountTtc: MoneyData::fromMoney($invoice->amount_ttc_cents),
            amountPaid: MoneyData::fromMoney($invoice->paidAmount()),
            amountDue: MoneyData::fromMoney($invoice->balanceDue()),
            ttcOverridden: $invoice->isTtcOverridden(),
            vatRateBp: $invoice->vat_rate_bp,
            notes: $invoice->notes,
            remindersEnabled: $invoice->reminders_enabled,
            remindersFrequency: $invoice->reminders_frequency,
            reminderRecipients: $invoice->reminder_recipients ?? [],
        );
    }
}
