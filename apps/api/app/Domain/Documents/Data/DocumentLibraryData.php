<?php

declare(strict_types=1);

namespace App\Domain\Documents\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class DocumentLibraryData extends Data
{
    /**
     * @param  list<DocumentGroupData>  $groups
     */
    public function __construct(
        #[DataCollectionOf(DocumentGroupData::class)]
        public array $groups,
    ) {}
}
