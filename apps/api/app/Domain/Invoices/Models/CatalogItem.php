<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Models;

use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Factories\CatalogItemFactory;
use App\Domain\Shared\Routing\OwnedRouteBinding;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Cknow\Money\Casts\MoneyIntegerCast;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property string $label
 * @property ?string $detail
 * @property LineUnit $unit
 * @property Money $unit_price_cents
 * @property string $currency
 * @property int $vat_rate_bp
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 */
#[Fillable(['label', 'detail', 'unit', 'currency', 'unit_price_cents', 'vat_rate_bp'])]
class CatalogItem extends Model
{
    /** @use HasFactory<CatalogItemFactory> */
    use HasFactory;

    protected static function newFactory(): CatalogItemFactory
    {
        return CatalogItemFactory::new();
    }

    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->catalogItems(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'unit' => LineUnit::class,
            'unit_price_cents' => MoneyIntegerCast::class.':currency',
            'vat_rate_bp' => 'integer',
        ];
    }
}
