<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\CreditNoteKind;
use App\Domain\Invoices\Enums\CreditNoteReason;
use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Enums\Currency;
use App\Domain\Shared\Money\Rate;
use App\Domain\Shared\Validation\AccountCurrency;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum as EnumRule;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/** What the credit note editor sends, to preview the credit note or to issue it. */
class IssueCreditNoteData extends Data
{
    /**
     * @param  list<CreditNoteLineInputData>  $lines  A partial credit note's lines; a full or balance one derives its own.
     */
    public function __construct(
        #[Enum(CreditNoteKind::class)]
        public CreditNoteKind $kind,
        #[Enum(CreditNoteReason::class)]
        public CreditNoteReason $reason,
        #[DataCollectionOf(CreditNoteLineInputData::class)]
        public array $lines = [],
        /** Printed on the credit note under its reason. */
        #[Max(500)]
        public ?string $detail = null,
        /**
         * What happens to money the client already paid: refunded by transfer, or
         * taken off a later invoice. Asked only when the credit note takes off more
         * than is left to pay; otherwise the invoice simply owes less.
         */
        #[Enum(CreditNoteSettlement::class)]
        public ?CreditNoteSettlement $settlement = null,
        /** The invoice's own language when omitted. */
        #[Enum(DocumentLanguage::class)]
        public ?DocumentLanguage $language = null,
    ) {}

    /**
     * Spelled out for the same reason as SaveInvoiceDraftData: a rules() entry
     * replaces every rule for its property, and the OpenAPI schema is built
     * from the resolved rules.
     *
     * @return array<string, list<mixed>>
     */
    public static function rules(): array
    {
        return [
            'lines' => ['present', 'array', 'max:200'],
            'lines.*.label' => ['required', 'string', 'max:255'],
            'lines.*.detail' => ['nullable', 'string', 'max:1000'],
            'lines.*.quantityMilli' => ['required', 'integer', 'between:1,100000000'],
            'lines.*.unit' => ['required', new EnumRule(LineUnit::class)],
            'lines.*.unitPrice' => ['required', 'array'],
            'lines.*.unitPrice.amount' => ['required', 'integer', 'min:1', 'max:'.MoneyData::MAX_AMOUNT],
            'lines.*.unitPrice.currency' => ['required', new EnumRule(Currency::class), new AccountCurrency],
            'lines.*.vatRateBp' => ['required', 'integer', 'between:0,'.Rate::BASIS_POINTS],
            'lines.*.invoiceLineId' => ['nullable', 'integer'],
            'settlement' => ['nullable', Rule::in([CreditNoteSettlement::Refund->value, CreditNoteSettlement::DeductFromNextInvoice->value])],
        ];
    }
}
