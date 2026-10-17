<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Data;

class DeductibleCreditNotesData extends Data
{
    /**
     * @param  list<DeductibleCreditNoteData>  $creditNotes
     */
    public function __construct(
        public array $creditNotes,
    ) {}
}
