<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Documents;

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
 */
final readonly class PaperDocument
{
    /**
     * @param  Party  $seller
     * @param  Party  $buyer
     * @param  list<array{label: string, detail: ?string, quantityMilli: int, unit: LineUnit, unitPrice: Money, vatRateBp: int}>  $lines
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
    ) {}
}
