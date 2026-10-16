<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Clients\Data\ClientData;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Missions\Data\MissionData;
use Spatie\LaravelData\Data;

class QuoteListItemData extends Data
{
    public function __construct(
        public QuoteData $quote,
        public ClientData $client,
        public ?MissionData $mission,
    ) {}

    public static function fromModel(Quote $quote): self
    {
        return new self(
            quote: QuoteData::fromModel($quote),
            client: ClientData::from($quote->client),
            mission: $quote->mission === null ? null : MissionData::from($quote->mission),
        );
    }
}
