<?php

declare(strict_types=1);

namespace App\Domain\Invoices\LatePayment;

use Carbon\CarbonImmutable;

/**
 * The late-payment figures in force this semester (art. L441-10 C. com.),
 * read from config/invoicing.php, where they are updated by hand when the
 * State publishes the next semester's rates.
 */
final readonly class LegalReference
{
    /**
     * @param  array<string, string>  $sources
     */
    public function __construct(
        public string $semester,
        public CarbonImmutable $checkedOn,
        public CarbonImmutable $nextRevisionOn,
        public int $legalInterestRateBp,
        public int $ecbRateBp,
        public int $recoveryFeeCents,
        public array $sources,
    ) {}

    public static function current(): self
    {
        /** @var array{semester: string, checked_on: string, next_revision_on: string, legal_interest_rate_bp: int, ecb_rate_bp: int, recovery_fee_cents: int, sources: array<string, string>} $reference */
        $reference = config('invoicing.legal_reference');

        return new self(
            semester: $reference['semester'],
            checkedOn: CarbonImmutable::parse($reference['checked_on']),
            nextRevisionOn: CarbonImmutable::parse($reference['next_revision_on']),
            legalInterestRateBp: $reference['legal_interest_rate_bp'],
            ecbRateBp: $reference['ecb_rate_bp'],
            recoveryFeeCents: $reference['recovery_fee_cents'],
            sources: $reference['sources'],
        );
    }

    /** A contractual penalty rate may not be lower than three times the legal interest rate. */
    public function minimumPenaltyRateBp(): int
    {
        return 3 * $this->legalInterestRateBp;
    }

    /** What the client owes when the invoice states no rate: the ECB rate plus ten points. */
    public function statutoryPenaltyRateBp(): int
    {
        return $this->ecbRateBp + 1000;
    }
}
