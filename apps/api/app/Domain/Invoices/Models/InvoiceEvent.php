<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Models;

use App\Domain\Invoices\Enums\InvoiceEventKind;
use App\Domain\Shared\Casts\CalendarDate;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $invoice_id
 * @property InvoiceEventKind $kind
 * @property CarbonImmutable $occurred_on
 * @property ?string $note
 * @property CarbonImmutable $created_at
 * @property-read Invoice $invoice
 */
#[Fillable([
    'kind',
    'occurred_on',
    'note',
])]
class InvoiceEvent extends Model
{
    const UPDATED_AT = null;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'kind' => InvoiceEventKind::class,
            'occurred_on' => CalendarDate::class,
        ];
    }

    /** @return BelongsTo<Invoice, $this> */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
