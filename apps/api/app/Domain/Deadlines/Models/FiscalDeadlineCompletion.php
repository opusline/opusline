<?php

declare(strict_types=1);

namespace App\Domain\Deadlines\Models;

use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Deadlines\Factories\FiscalDeadlineCompletionFactory;
use App\Domain\Shared\Casts\CalendarDate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * The user's tick against one occurrence of a fiscal deadline. The deadlines
 * themselves are derived from the fiscal profile on every request, so this row
 * is the only durable trace of one — keyed by period rather than by date, so a
 * changed CA3 day does not resurrect something already declared.
 *
 * @property int $id
 * @property int $user_id
 * @property FiscalDeadlineKind $kind
 * @property string $period_key
 * @property CarbonImmutable $due_on
 * @property CarbonImmutable $completed_on
 * @property CarbonImmutable $created_at
 * @property CarbonImmutable $updated_at
 * @property-read User $user
 */
#[Fillable([
    'kind',
    'period_key',
    'due_on',
    'completed_on',
])]
#[Table('fiscal_deadline_completions')]
class FiscalDeadlineCompletion extends Model
{
    /** @use HasFactory<FiscalDeadlineCompletionFactory> */
    use HasFactory;

    protected static function newFactory(): FiscalDeadlineCompletionFactory
    {
        return FiscalDeadlineCompletionFactory::new();
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
            'kind' => FiscalDeadlineKind::class,
            'due_on' => CalendarDate::class,
            'completed_on' => CalendarDate::class,
        ];
    }

    /** Identity across a request, matching FiscalDeadline::key(). */
    public function key(): string
    {
        return "{$this->kind->value}:{$this->period_key}";
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
