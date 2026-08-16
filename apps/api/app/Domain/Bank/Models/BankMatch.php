<?php

declare(strict_types=1);

namespace App\Domain\Bank\Models;

use App\Domain\Bank\Enums\BankMatchReason;
use App\Domain\Bank\Enums\BankMatchStatus;
use App\Domain\Bank\Factories\BankMatchFactory;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Shared\Routing\OwnedRouteBinding;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property int $bank_movement_id
 * @property int $invoice_id
 * @property BankMatchStatus $status
 * @property BankMatchReason $reason
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 * @property-read BankMovement $movement
 * @property-read Invoice $invoice
 */
#[Fillable([
    'bank_movement_id',
    'invoice_id',
    'status',
    'reason',
])]
class BankMatch extends Model
{
    /** @use HasFactory<BankMatchFactory> */
    use HasFactory;

    protected static function newFactory(): BankMatchFactory
    {
        return BankMatchFactory::new();
    }

    /**
     * Scope every {match} route binding to the authenticated user, so a
     * foreign row resolves to a 404 instead of leaking across accounts.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     */
    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->bankMatches(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return [
            'status' => BankMatchStatus::class,
            'reason' => BankMatchReason::class,
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<BankMovement, $this> */
    public function movement(): BelongsTo
    {
        return $this->belongsTo(BankMovement::class, 'bank_movement_id');
    }

    /** @return BelongsTo<Invoice, $this> */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
