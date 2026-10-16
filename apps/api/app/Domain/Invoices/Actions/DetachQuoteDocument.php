<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Models\Quote;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class DetachQuoteDocument
{
    public function __construct(private readonly LockQuote $lockQuote) {}

    public function handle(Quote $quote): void
    {
        $this->lockQuote->handle($quote, function (Quote $locked): void {
            abort_if($locked->isWrittenInOpusline(), 409, __('quotes.document_is_opuslines'));
            $document = $locked->attachedDocument();
            abort_if(! $document instanceof Media, 404);
            $document->delete();
        });
    }
}
