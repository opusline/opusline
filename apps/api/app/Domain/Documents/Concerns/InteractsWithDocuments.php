<?php

declare(strict_types=1);

namespace App\Domain\Documents\Concerns;

use Illuminate\Database\Eloquent\Relations\MorphMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * The `documents` media collection, read as a relation.
 *
 * Newest first, and `id` breaks the tie: several files uploaded in the same second
 * would otherwise come back in an arbitrary order that reshuffles between requests.
 *
 * @phpstan-require-implements HasMedia
 */
trait InteractsWithDocuments
{
    public const string DOCUMENT_COLLECTION = 'documents';

    /** @return MorphMany<Media, $this> */
    public function documents(): MorphMany
    {
        return $this->media()
            ->where('collection_name', self::DOCUMENT_COLLECTION)
            ->orderByDesc('created_at')
            ->orderByDesc('id');
    }
}
