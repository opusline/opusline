<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\InvoiceSource;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Enums\ReminderFrequency;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Revenue\NetIncome;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Data\SignedMoneyData;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
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
        /** What credit notes took off it, incl. VAT. */
        public MoneyData $amountCredited,
        /** What the client still owes, net of the credit notes; below zero, the client is owed money back. */
        public SignedMoneyData $amountDue,
        /**
         * What reaches the personal account from this invoice (since 0.33.7): `amountHt`
         * less the URSSAF settlement (cotisations, CFP, and the versement libératoire when
         * the option is on) at the rate of the declaration period it is collected in, and,
         * without the versement libératoire, less the income tax at the withholding rate on
         * `amountHt` minus the 34 % micro-BNC abatement. The TVA is not in `amountHt` to
         * begin with; the CFE, subscriptions and matelas are not deducted. Cash basis: each
         * payment (a refund or a credit-note deduction as a negative one) is priced on the
         * day it landed, what is still due on today, so credit notes are taken off and a
         * cancelled invoice nets to zero. Null for a draft, and for an account outside
         * French fiscality.
         */
        public ?SignedMoneyData $amountNet,
        public bool $ttcOverridden,
        public int $vatRateBp,
        public ?string $notes,
        public bool $remindersEnabled,
        public ReminderFrequency $remindersFrequency,
        /** @var list<string> */
        public array $reminderRecipients,
    ) {}

    public static function fromModel(Invoice $invoice, ?NetIncome $netIncome): self
    {
        $amountNet = $netIncome?->ofInvoice($invoice);

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
            amountCredited: MoneyData::fromMoney($invoice->creditedAmount()),
            amountDue: SignedMoneyData::fromMoney($invoice->balanceDue()),
            amountNet: $amountNet instanceof Money ? SignedMoneyData::fromMoney($amountNet) : null,
            ttcOverridden: $invoice->isTtcOverridden(),
            vatRateBp: $invoice->vat_rate_bp,
            notes: $invoice->notes,
            remindersEnabled: $invoice->reminders_enabled,
            remindersFrequency: $invoice->reminders_frequency,
            reminderRecipients: $invoice->reminder_recipients ?? [],
        );
    }
}
