<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Validation\AuthenticatedUserId;
use App\Domain\Shared\Validation\BeforeOrEqualAccountToday;
use Spatie\LaravelData\Attributes\Validation\Between;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\Constraints\WhereConstraint;

/** A quote issued in another tool, recorded so Opusline follows its answer and what it bills. */
class CreateExternalQuoteData extends Data
{
    public function __construct(
        #[IntegerType]
        #[Exists('clients', 'id', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public int $clientId,
        /** The reference the other tool printed; outside Opusline's own series. */
        #[Min(1), Max(255)]
        #[Unique('quotes', 'number', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public string $number,
        public MoneyData $amountHt,
        #[DateFormat('Y-m-d'), Rule(new BeforeOrEqualAccountToday)]
        public string $issuedOn,
        /** Sent, accepted or refused: a quote the client holds is never a draft. */
        #[Enum(QuoteStatus::class)]
        public QuoteStatus $status,
        #[IntegerType]
        #[Exists('missions', 'id', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public ?int $missionId = null,
        #[Max(255)]
        public ?string $title = null,
        #[IntegerType, Between(0, 10000)]
        public ?int $vatRateBp = null,
        /** The day the client answered, for an accepted or refused quote; today when omitted. */
        #[DateFormat('Y-m-d'), Rule(new BeforeOrEqualAccountToday)]
        public ?string $decidedOn = null,
    ) {}
}
