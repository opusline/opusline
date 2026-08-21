<?php

declare(strict_types=1);

namespace App\Domain\Documents\Data;

use App\Domain\Shared\Enums\Color;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class DocumentGroupData extends Data
{
    /**
     * @param  ?string  $missionSlug  Null on a client's own group — what tells the two apart.
     * @param  list<DocumentData>  $documents
     */
    public function __construct(
        public string $name,
        public Color $color,
        public string $clientName,
        public string $clientSlug,
        public ?string $missionSlug,
        public CarbonImmutable $lastAddedAt,
        #[DataCollectionOf(DocumentData::class)]
        public array $documents,
    ) {}
}
