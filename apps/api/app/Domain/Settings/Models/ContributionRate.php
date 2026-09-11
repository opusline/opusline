<?php

declare(strict_types=1);

namespace App\Domain\Settings\Models;

use App\Domain\Shared\Casts\CalendarDate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * The URSSAF rate an account paid from a given day.
 *
 * Written only when the rate moves — an ACRE step ending, a versement libératoire
 * switched on, a hand-typed correction — so a settled account holds no rows at
 * all and the current setting answers for every period.
 *
 * @property int $id
 * @property int $user_id
 * @property int $effective_rate_bp
 * @property CarbonImmutable $effective_from
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 */
#[Fillable([
    'user_id',
    'effective_rate_bp',
    'effective_from',
])]
class ContributionRate extends Model
{
    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'effective_rate_bp' => 'integer',
            'effective_from' => CalendarDate::class,
        ];
    }
}
