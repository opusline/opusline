<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Shared\Validation\AuthenticatedUserId;
use Spatie\LaravelData\Attributes\Validation\AfterOrEqual;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Attributes\Validation\DateFormat;
use Spatie\LaravelData\Attributes\Validation\Enum;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\Constraints\WhereConstraint;

/**
 * The Factures screen, the client fiche and the mission fiche all read the same
 * endpoint; the filters are what tell them apart.
 */
class ListInvoicesData extends Data
{
    public function __construct(
        #[Enum(InvoiceStatus::class)]
        public ?InvoiceStatus $status = null,
        #[IntegerType]
        #[Exists('clients', 'id', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public ?int $clientId = null,
        #[IntegerType]
        #[Exists('missions', 'id', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public ?int $missionId = null,
        #[BooleanType]
        public ?bool $late = null,
        #[DateFormat('Y-m-d')]
        public ?string $from = null,
        #[DateFormat('Y-m-d'), AfterOrEqual('from')]
        public ?string $to = null,
        /** Opaque, from a previous page's `nextCursor`; omit for the first page. */
        #[StringType, Max(1024)]
        public ?string $cursor = null,
    ) {}

    /** A client or mission fiche's slice, as opposed to the Factures ledger. */
    public function isFicheSlice(): bool
    {
        return $this->clientId !== null || $this->missionId !== null;
    }
}
