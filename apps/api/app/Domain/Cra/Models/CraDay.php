<?php

declare(strict_types=1);

namespace App\Domain\Cra\Models;

use App\Domain\Shared\Casts\CalendarDate;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One worked day of a CRA. A date with no row is a day not worked — the grid stores
 * what was done, not a cell per calendar square.
 *
 * @property int $id
 * @property int $cra_id
 * @property CarbonImmutable $date
 * @property int $day_fraction_bp
 * @property-read Cra $cra
 */
#[Fillable(['date', 'day_fraction_bp'])]
#[Table('cra_days')]
#[WithoutTimestamps]
class CraDay extends Model
{
    /** A full workday, in basis points. */
    public const int FULL_DAY_BP = 10_000;

    /** Basis points of a workday as the number of days a human reads. */
    public static function daysFromBasisPoints(int $basisPoints): float
    {
        return $basisPoints / self::FULL_DAY_BP;
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
            'date' => CalendarDate::class,
            'day_fraction_bp' => 'integer',
        ];
    }

    /** @return BelongsTo<Cra, $this> */
    public function cra(): BelongsTo
    {
        return $this->belongsTo(Cra::class);
    }
}
