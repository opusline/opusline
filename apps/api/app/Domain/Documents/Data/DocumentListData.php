<?php

declare(strict_types=1);

namespace App\Domain\Documents\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class DocumentListData extends Data
{
    /**
     * @param  list<DocumentData>  $documents
     */
    public function __construct(
        #[DataCollectionOf(DocumentData::class)]
        public array $documents,
    ) {}
}
