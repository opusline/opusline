<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Data;

use App\Domain\Deadlines\Enums\DeadlineItemType;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/**
 * One line of the Échéances timeline. `dueOn` is lifted to the top so ordering
 * and the week tile read one field; what the line is about sits in the block
 * its type names — `invoice` for the two invoice-borne types, `fiscal` for the
 * calendar's own.
 */
class DeadlineItemData extends Data
{
    public function __construct(
        public DeadlineItemType $type,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $dueOn,
        public ?DeadlineInvoiceData $invoice,
        public ?FiscalDeadlineData $fiscal,
    ) {}
}
