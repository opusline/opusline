<?php

declare(strict_types=1);

namespace App\Domain\Documents\Data;

use App\Domain\Documents\Enums\DocumentCategory;
use Spatie\LaravelData\Data;

class UpdateDocumentData extends Data
{
    public function __construct(
        public DocumentCategory $category,
    ) {}
}
