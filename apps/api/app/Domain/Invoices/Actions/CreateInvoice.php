<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\CreateInvoiceData;
use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CreateInvoice
{
    public function __construct(
        private readonly ValidateInvoice $validateInvoice,
        private readonly ComputeInvoiceAmounts $computeInvoiceAmounts,
        private readonly RecordInvoiceEvent $recordInvoiceEvent,
    ) {}

    public function handle(User $user, CreateInvoiceData $data): Invoice
    {
        $issuedOn = $data->issuedOn === null
            ? CarbonImmutable::today()
            : CarbonImmutable::parse($data->issuedOn);

        $this->validateInvoice->forCreate($user, $data, $issuedOn);

        $client = $user->clients()->whereKey($data->clientId)->firstOrFail();
        $status = $data->status ?? InvoiceStatus::Draft;
        $vatRateBp = $data->vatRateBp ?? $user->settings()->sole()->effectiveVatRateBp();
        $amountHt = $data->amountHt->toMoney();

        $attributes = [
            'client_id' => $client->id,
            'mission_id' => $data->missionId,
            'number' => $data->number,
            'status' => $status,
            'issued_on' => $issuedOn,
            'due_on' => $data->dueOn ?? $issuedOn->addDays($client->payment_terms_days),
            'paid_on' => $data->paidOn,
            'period_start' => $data->periodStart,
            'period_end' => $data->periodEnd,
            'currency' => $data->amountHt->currency->value,
            'amount_ht_cents' => $amountHt,
            'amount_ttc_cents' => $data->amountTtc?->toMoney()
                ?? $this->computeInvoiceAmounts->ttcFor($amountHt, $vatRateBp),
            'vat_rate_bp' => $vatRateBp,
            'notes' => $data->notes,
        ];

        return DB::transaction(function () use ($user, $attributes, $status, $issuedOn): Invoice {
            User::query()->whereKey($user->getKey())->lockForUpdate()->firstOrFail();

            try {
                $invoice = $user->invoices()->create($attributes);
            } catch (UniqueConstraintViolationException) {
                // Two creates that both took the same suggestion from /next-number pass
                // the #[Unique] check and then race to the index. (user_id, number) is
                // the table's only unique index, so this can only be that one; a
                // foreign-key violation is a different bug and must not be masked.
                throw ValidationException::withMessages([
                    'number' => __('invoices.number_taken'),
                ]);
            }

            $this->recordHistory($invoice, $status, $issuedOn);

            return $invoice;
        });
    }

    private function recordHistory(Invoice $invoice, InvoiceStatus $status, CarbonImmutable $issuedOn): void
    {
        $this->recordInvoiceEvent->handle($invoice, InvoiceEventKind::Created, $issuedOn);

        if ($status->isIssued()) {
            $this->recordInvoiceEvent->handle($invoice, InvoiceEventKind::Sent, $issuedOn);
        }

        if ($status === InvoiceStatus::Paid) {
            $this->recordInvoiceEvent->handle($invoice, InvoiceEventKind::Paid, $invoice->paid_on);
        }
    }
}
