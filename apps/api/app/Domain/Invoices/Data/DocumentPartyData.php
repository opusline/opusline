<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Data;

use Spatie\LaravelData\Data;

/** The seller or the buyer, as an issued document prints them. */
class DocumentPartyData extends Data
{
    /**
     * @param  list<string>  $addressLines
     */
    public function __construct(
        public string $name,
        /** « EI » after an entrepreneur individuel's name. */
        public ?string $legalMention,
        public ?string $siret,
        public ?string $siren,
        public ?string $vatNumber,
        public ?string $tradeRegistry,
        public array $addressLines,
        public ?string $email,
        public ?string $phone,
        public ?string $iban,
        public ?string $bic,
        /** Under the franchise: the document prints « TVA non applicable, art. 293 B du CGI ». */
        public bool $vatExempt,
    ) {}
}
