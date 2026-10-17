<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Models\InvoicePayment;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class InvoicePaymentData extends Data
{
    public function __construct(
        public int $id,
        /** Negative for money that went back to the client. */
        public MoneyData $amount,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $paidOn,
        /** The bank movement an accepted match paid it with; null for a payment recorded by hand. */
        public ?int $bankMovementId,
        public ?string $note,
    ) {}

    public static function fromModel(InvoicePayment $payment): self
    {
        return new self(
            id: $payment->id,
            amount: MoneyData::fromMoney($payment->amount_cents),
            paidOn: $payment->paid_on,
            bankMovementId: $payment->bank_movement_id,
            note: $payment->note,
        );
    }
}
