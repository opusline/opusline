<?php

declare(strict_types=1);

namespace App\Domain\Settings\Models;

use App\Domain\Settings\Enums\FiscalDeadlineKind;
use App\Domain\Settings\Factories\FiscalDeclarationFactory;
use App\Domain\Shared\Casts\CalendarDate;
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
 * @property FiscalDeadlineKind $kind
 * @property string $period
 * @property CarbonImmutable $filed_on
 * @property ?Money $declared_amount_cents
 * @property string $currency
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 */
#[Fillable([
    'kind',
    'period',
    'filed_on',
    'currency',
    'declared_amount_cents',
])]
class FiscalDeclaration extends Model
{
    /** @use HasFactory<FiscalDeclarationFactory> */
    use HasFactory;

    protected static function newFactory(): FiscalDeclarationFactory
    {
        return FiscalDeclarationFactory::new();
    }

    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'kind' => FiscalDeadlineKind::class,
            'filed_on' => CalendarDate::class,
            'declared_amount_cents' => MoneyIntegerCast::class.':currency',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
