<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Models;

use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A recurring bank debit the user chose not to turn into a subscription —
 * remembered by its fingerprint so the banner never asks twice.
 *
 * @property int $id
 * @property int $user_id
 * @property string $label_key
 * @property int $amount_cents
 * @property-read User $user
 */
#[Fillable([
    'label_key',
    'amount_cents',
])]
class RecurringDebitDismissal extends Model
{
    /**
     * @return array<string, string>
     */
    #[\Override]
    protected function casts(): array
    {
        return ['amount_cents' => 'integer'];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
