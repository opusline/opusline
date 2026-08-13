<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Validation\AuthenticatedUserId;
use Spatie\LaravelData\Attributes\Validation\BeforeOrEqual;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\Constraints\WhereConstraint;

class CreateInvoiceData extends Data
{
    /**
     * @param  list<int>  $timeEntryIds  Tracked time this invoice covers, marked as
     *                                   billed so it stops counting as work to invoice.
     */
    public function __construct(
        #[IntegerType]
        #[Exists('clients', 'id', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public int $clientId,
        public MoneyData $amountHt,
        #[IntegerType]
        #[Exists('missions', 'id', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public ?int $missionId = null,
        #[Min(1), Max(255)]
        #[Unique('invoices', 'number', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public ?string $number = null,
        #[Enum(InvoiceStatus::class)]
        public ?InvoiceStatus $status = null,
        #[DateFormat('Y-m-d')]
        public ?string $issuedOn = null,
        #[DateFormat('Y-m-d')]
        public ?string $dueOn = null,
        #[DateFormat('Y-m-d'), BeforeOrEqual('today')]
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
        public array $timeEntryIds = [],
    ) {}

    /**
     * Inference would make this required, and an empty array does not satisfy
     * `required` — covering no time is the normal case for an invoice typed by hand.
     *
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return [
            'timeEntryIds' => ['array'],
            'timeEntryIds.*' => ['integer'],
        ];
    }
}
