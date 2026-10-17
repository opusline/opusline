<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use App\Domain\Clients\Data\ClientData;
use App\Domain\Documents\Data\DocumentData;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Missions\Data\MissionData;
use Spatie\LaravelData\Data;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class QuoteDetailData extends Data
{
    public function __construct(
        public QuoteData $quote,
        public ClientData $client,
        public ?MissionData $mission,
        public QuoteContentData $content,
        /** The PDF filed with the client's documents when the quote was validated. */
        public ?DocumentData $document,
        public QuoteBillingData $billing,
        /** @var list<DocumentEmailData> The e-mails it was sent in, oldest first. */
        public array $emails,
    ) {}

    public static function fromModel(Quote $quote): self
    {
        $document = $quote->attachedDocument();

        return new self(
            quote: QuoteData::fromModel($quote),
            client: ClientData::from($quote->client),
            mission: $quote->mission === null ? null : MissionData::from($quote->mission),
            content: QuoteContentData::fromQuote($quote),
            document: $document instanceof Media ? DocumentData::fromMedia($document) : null,
            billing: QuoteBillingData::fromQuote($quote),
            emails: array_values($quote->emails->map(DocumentEmailData::fromModel(...))->all()),
        );
    }
}
