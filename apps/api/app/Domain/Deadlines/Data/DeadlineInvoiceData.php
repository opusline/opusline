<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Data;

use App\Domain\Invoices\Models\Invoice;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * The invoice behind a timeline line — enough for the client to compose both
 * the due row (« F-2026-028 · Catamania ») and the relance row under it,
 * without a second fetch.
 */
class DeadlineInvoiceData extends Data
{
    public function __construct(
        public int $id,
        public ?string $number,
        public string $clientName,
        public ?string $missionName,
        /** First day of the period billed, for the « Mars 2026 » sub-line. */
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $periodStart,
        public MoneyData $amount,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $dueOn,
        public int $remindersSent,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $lastRemindedOn,
    ) {}

    /**
     * $invoice must carry the `reminders_sent` count and `last_reminded_on`
     * aggregates ListInvoiceDeadlines selects; reading them via getAttribute is
     * what keeps the model docblock honest about its real columns.
     */
    public static function fromInvoice(Invoice $invoice): self
    {
        $remindersSent = $invoice->getAttribute('reminders_sent');
        $lastRemindedOn = $invoice->getAttribute('last_reminded_on');

        return new self(
            id: $invoice->id,
            number: $invoice->number,
            clientName: $invoice->client->name,
            missionName: $invoice->mission?->name,
            periodStart: $invoice->period_start,
            amount: MoneyData::fromMoney($invoice->amount_ttc_cents),
            dueOn: $invoice->due_on,
            remindersSent: is_numeric($remindersSent) ? (int) $remindersSent : 0,
            lastRemindedOn: is_string($lastRemindedOn) && $lastRemindedOn !== ''
                ? CarbonImmutable::parse($lastRemindedOn)
                : null,
        );
    }
}
