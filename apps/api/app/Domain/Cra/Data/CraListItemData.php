<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Shared\Enums\Color;
use Spatie\LaravelData\Data;

/**
 * A CRA the user owes or has produced. `id` is null for a month that still has to be
 * produced: the row is created when the user opens it, never by listing.
 */
class CraListItemData extends Data
{
    public function __construct(
        public ?int $id,
        public int $missionId,
        public string $missionSlug,
        public string $missionName,
        public string $clientSlug,
        public string $clientName,
        public Color $color,
        /** The covered month as `Y-m`. */
        public string $month,
        public CraStatus $status,
        public float $totalDays,
        public float $trackedDays,
    ) {}
}
