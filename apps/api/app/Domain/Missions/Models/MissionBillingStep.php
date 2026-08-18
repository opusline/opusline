<?php

declare(strict_types=1);

namespace App\Domain\Missions\Models;

use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Factories\MissionBillingStepFactory;
use App\Domain\Shared\Casts\CalendarDate;
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
 * One instalment of a fixed price: what to bill, and what has to happen first.
 *
 * A step is a plan, never money. It is not revenue, it is not work waiting to be
 * invoiced, and no total on any screen is made of steps — billing one creates an
 * ordinary invoice, and the invoice is what counts. Deleting the whole schedule
 * would leave every figure in the app exactly where it was.
 *
 * @property int $id
 * @property int $user_id
 * @property int $mission_id
 * @property string $label
 * @property Money $amount_cents
 * @property int $position
 * @property ?CarbonImmutable $due_on
 * @property ?CarbonImmutable $ready_at
 * @property ?int $invoice_id
 * @property-read Mission $mission
 * @property-read ?Invoice $invoice
 */
#[Fillable([
    'mission_id',
    'label',
    'currency',
    'amount_cents',
    'position',
    'due_on',
    'ready_at',
    'invoice_id',
])]
class MissionBillingStep extends Model
{
    /** @use HasFactory<MissionBillingStepFactory> */
    use HasFactory;

    protected static function newFactory(): MissionBillingStepFactory
    {
        return MissionBillingStepFactory::new();
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
            'amount_cents' => MoneyIntegerCast::class.':currency',
            'position' => 'integer',
            'due_on' => CalendarDate::class,
            'ready_at' => 'datetime',
        ];
    }

    /**
     * Scope every {billingStep} route binding to the authenticated user, so a
     * foreign row resolves to a 404 instead of leaking across accounts.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     */
    #[\Override]
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return OwnedRouteBinding::resolve(
            auth()->user()?->billingSteps(),
            $field ?? $this->getRouteKeyName(),
            $value,
        );
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Mission, $this> */
    public function mission(): BelongsTo
    {
        return $this->belongsTo(Mission::class);
    }

    /** @return BelongsTo<Invoice, $this> */
    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }
}
