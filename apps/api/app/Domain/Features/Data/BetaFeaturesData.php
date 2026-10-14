<?php

declare(strict_types=1);

namespace App\Domain\Features\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/** The features this instance offers in beta, with whether the account opted in. */
class BetaFeaturesData extends Data
{
    /**
     * @param  list<BetaFeatureData>  $features
     */
    public function __construct(
        #[DataCollectionOf(BetaFeatureData::class)]
        public array $features,
    ) {}
}
