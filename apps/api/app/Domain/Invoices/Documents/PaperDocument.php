<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Documents;

use App\Domain\Invoices\Enums\CreditNoteReason;
use App\Domain\Invoices\Enums\CreditNoteSettlement;
use App\Domain\Invoices\Enums\DocumentKind;
use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Enums\OperationCategory;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;

/**
 * What a document sheet needs, whether it comes from a stored invoice or
 * quote, or from an editor draft that was never saved.
 *
 * @phpstan-import-type Party from DocumentParties
 *
 * @phpstan-type PaperLine array{label: string, detail: ?string, quantityMilli: int, unit: LineUnit, unitPrice: Money, vatRateBp: int}
 */
final readonly class PaperDocument
{
    /**
     * @param  Party  $seller
     * @param  Party  $buyer
     * @param  list<PaperLine>  $lines
     * @param  ?CarbonImmutable  $dueOn  An invoice's due date; a quote has none.
     * @param  ?CarbonImmutable  $validUntil  A quote's last day; an invoice has none.
     */
    public function __construct(
        public DocumentKind $kind,
        public ?string $number,
        public CarbonImmutable $issuedOn,
        public ?CarbonImmutable $dueOn,
        public ?CarbonImmutable $validUntil,
        public ?CarbonImmutable $periodStart,
        public ?CarbonImmutable $periodEnd,
        public ?string $title,
        public ?string $description,
        public OperationCategory $operationCategory,
        public array $seller,
        public array $buyer,
        public array $lines,
        public string $currency,
        public PaymentTerm $term,
        public ?int $latePenaltyRateBp,
        public ?int $depositRateBp,
        public bool $showIban,
        public bool $vatOnDebits,
        public ?string $customMentions,
        public bool $hasLogo,
        /** An invoice built from a quote says so, and a balance names the deposits it deducts. */
        public ?string $quoteMention = null,
        /** A credit note: the invoice it relates to, why, and what becomes of its amount. */
        public ?CreditedInvoice $creditedInvoice = null,
        public ?CreditNoteReason $creditNoteReason = null,
        public ?CreditNoteSettlement $creditNoteSettlement = null,
        /**
         * Credit notes of earlier invoices this invoice deducts, printed under its total.
         *
         * @var list<array{number: string, amount: Money}>
         */
        public array $deductions = [],
    ) {}
}
