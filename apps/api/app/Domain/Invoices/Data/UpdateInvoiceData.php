<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Validation\AuthenticatedUserId;
use App\Domain\Shared\Validation\BeforeOrEqualAccountToday;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\Constraints\WhereConstraint;

/**
 * Status is deliberately absent: draft -> sent -> paid are their own endpoints, so
 * every transition is recorded in the invoice's history instead of slipping through
 * as a field edit.
 *
 * `number` uniqueness is checked in ValidateInvoice rather than with #[Unique] —
 * the rule would need to ignore the invoice's own row, and the id is not available
 * to a static attribute.
 */
class UpdateInvoiceData extends Data
{
    public function __construct(
        #[IntegerType]
        #[Exists('clients', 'id', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public int $clientId,
        public MoneyData $amountHt,
        #[IntegerType]
        #[Exists('missions', 'id', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public ?int $missionId = null,
        #[Min(1), Max(255)]
        public ?string $number = null,
        #[DateFormat('Y-m-d')]
        public ?string $issuedOn = null,
        #[DateFormat('Y-m-d')]
        public ?string $dueOn = null,
        /**
         * Moving this shifts revenue between declaration periods: URSSAF and TVA are
         * cash-basis. Editable on purpose, because corrections happen.
         */
        #[DateFormat('Y-m-d'), Rule(new BeforeOrEqualAccountToday)]
        public ?string $paidOn = null,
        #[DateFormat('Y-m-d')]
        public ?string $periodStart = null,
        #[DateFormat('Y-m-d')]
        public ?string $periodEnd = null,
        public ?MoneyData $amountTtc = null,
        #[IntegerType, Between(0, 10000)]
        public ?int $vatRateBp = null,
        #[Max(2000)]
        public ?string $notes = null,
    ) {}
}
