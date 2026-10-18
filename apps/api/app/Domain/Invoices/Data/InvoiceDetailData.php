<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Clients\Data\ClientData;
use App\Domain\Documents\Data\DocumentData;
use App\Domain\Invoices\Enums\EmailTemplateKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\DocumentEmail;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Invoices\Reminders\ReminderSchedule;
use App\Domain\Invoices\Revenue\NetIncome;
use App\Domain\Missions\Data\MissionData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class InvoiceDetailData extends Data
{
    /**
     * @param  list<InvoiceEventData>  $history
     * @param  list<InvoiceStatus>  $nextStatuses
     */
    public function __construct(
        public InvoiceData $invoice,
        public ClientData $client,
        public ?MissionData $mission,
        #[DataCollectionOf(InvoiceEventData::class)]
        public array $history,
        /** The document the invoice is, once one has been filed against it. */
        public ?DocumentData $document,
        /** Its lines and options when Opusline wrote it; null for an invoice recorded from another tool. */
        public ?InvoiceContentData $content,
        /** The quote it was built from, when it was. */
        public ?InvoiceQuoteLinkData $quote,
        /** @var list<DocumentEmailData> The e-mails it was sent in, oldest first. */
        #[DataCollectionOf(DocumentEmailData::class)]
        public array $emails,
        /** @var list<InvoicePaymentData> The money that landed on it, oldest first. */
        #[DataCollectionOf(InvoicePaymentData::class)]
        public array $payments,
        /** @var list<CreditNoteData> The credit notes issued on it, oldest first. */
        #[DataCollectionOf(CreditNoteData::class)]
        public array $creditNotes,
        /** @var list<CreditNoteData> Credit notes of earlier invoices it deducts. */
        #[DataCollectionOf(CreditNoteData::class)]
        public array $deductedCreditNotes,
        /** The day the next automatic reminder leaves; null when none is due any more, or none was asked. */
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public ?CarbonImmutable $nextReminderOn,
        /** The statuses it can move to from where it stands: what a screen may offer. */
        public array $nextStatuses,
    ) {}

    public static function fromModel(Invoice $invoice, ?NetIncome $netIncome): self
    {
        $document = $invoice->attachedDocument();

        return new self(
            invoice: InvoiceData::fromModel($invoice, $netIncome),
            client: ClientData::from($invoice->client),
            mission: $invoice->mission === null ? null : MissionData::from($invoice->mission),
            history: array_values(InvoiceEventData::collect($invoice->events->all(), 'array')),
            document: $document instanceof Media ? DocumentData::fromMedia($document) : null,
            content: $invoice->isWrittenInOpusline() ? InvoiceContentData::fromInvoice($invoice) : null,
            quote: InvoiceQuoteLinkData::fromInvoice($invoice),
            emails: array_values($invoice->emails->map(DocumentEmailData::fromModel(...))->all()),
            payments: array_values($invoice->payments->map(InvoicePaymentData::fromModel(...))->all()),
            creditNotes: array_values($invoice->creditNotes->map(CreditNoteData::fromModel(...))->all()),
            deductedCreditNotes: array_values($invoice->deductedCreditNotes->map(CreditNoteData::fromModel(...))->all()),
            nextReminderOn: self::nextReminderOn($invoice),
            nextStatuses: $invoice->lifecycle->nextStatuses(),
        );
    }

    private static function nextReminderOn(Invoice $invoice): ?CarbonImmutable
    {
        if (! $invoice->reminders_enabled || ! $invoice->status->canBeReminded()) {
            return null;
        }

        $sent = $invoice->emails->filter(static fn (DocumentEmail $email): bool => $email->kind === EmailTemplateKind::PaymentReminder)->count();

        return ReminderSchedule::nextOn($invoice->reminders_frequency, $invoice->due_on, $sent);
    }
}
