<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Models;

use App\Domain\Invoices\Enums\LineUnit;
use Carbon\CarbonImmutable;
use Cknow\Money\Casts\MoneyIntegerCast;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $credit_note_id
 * @property ?int $invoice_line_id
 * @property int $position
 * @property string $label
 * @property ?string $detail
 * @property int $quantity_milli
 * @property LineUnit $unit
 * @property Money $unit_price_cents
 * @property string $currency
 * @property int $vat_rate_bp
 * @property Money $total_ht_cents
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read CreditNote $creditNote
 */
#[Fillable(['invoice_line_id', 'position', 'label', 'detail', 'quantity_milli', 'unit', 'currency', 'unit_price_cents', 'vat_rate_bp', 'total_ht_cents'])]
class CreditNoteLine extends Model
{
    /** @return BelongsTo<CreditNote, $this> */
    public function creditNote(): BelongsTo
    {
        return $this->belongsTo(CreditNote::class);
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'quantity_milli' => 'integer',
            'unit' => LineUnit::class,
            'unit_price_cents' => MoneyIntegerCast::class.':currency',
            'vat_rate_bp' => 'integer',
            'total_ht_cents' => MoneyIntegerCast::class.':currency',
        ];
    }
}
