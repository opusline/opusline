<?php

declare(strict_types=1);

use App\Domain\Expenses\Data\ReceiptSuggestionData;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Enums\ReceiptFieldConfidence;
use App\Domain\Expenses\Receipts\ReceiptHeuristics;
use App\Domain\Shared\Enums\Currency;
use Carbon\CarbonImmutable;

function readReceipt(string $text, string $today = '2026-08-13'): ReceiptSuggestionData
{
    return ReceiptHeuristics::suggest($text, CarbonImmutable::parse($today), Currency::EUR);
}

test('reads a French invoice field by field', function (): void {
    $reading = readReceipt(<<<'TXT'
    NORDLYS CLOUD SAS
    12 rue des Fjords · 75011 Paris
    SIRET 812 345 678 00019 · TVA FR12812345678
    
    FACTURE N° F-2026-0412
    Date de facture : 12/08/2026
    Date d'échéance : 30/08/2026
    Client : Théo Benoit
    
    Désignation	Qté	Prix HT	Total HT
    Hébergement VPS Pro · août 2026	1	35,00 €	35,00 €
    Nom de domaine opusline.fr · renouvellement	1	12,00 €	12,00 €
    
    Total HT	47,00 €
    TVA 20 %	9,40 €
    Total TTC	56,40 €
    TXT);

    expect($reading->textFound)->toBeTrue()
        ->and($reading->supplier?->value)->toBe('Nordlys Cloud SAS')
        ->and($reading->supplier?->confidence)->toBe(ReceiptFieldConfidence::Medium)
        ->and($reading->spentOn?->value->toDateString())->toBe('2026-08-12')
        ->and($reading->spentOn?->confidence)->toBe(ReceiptFieldConfidence::High)
        ->and($reading->amountTtc?->value->amount)->toBe(5_640)
        ->and($reading->amountTtc?->value->currency)->toBe(Currency::EUR)
        ->and($reading->amountTtc?->confidence)->toBe(ReceiptFieldConfidence::High)
        ->and($reading->vat?->treatment)->toBe(ExpenseVatTreatment::Domestic)
        ->and($reading->vat?->rateBp)->toBe(2_000)
        ->and($reading->vat?->confidence)->toBe(ReceiptFieldConfidence::High)
        ->and($reading->description?->value)->toBe('Hébergement VPS Pro · août 2026')
        ->and($reading->description?->confidence)->toBe(ReceiptFieldConfidence::Low)
        ->and($reading->category)->toBe(ExpenseCategory::Hosting);
});

test('an EU SaaS invoice under reverse charge reads as autoliquidation UE', function (): void {
    $reading = readReceipt(<<<'TXT'
    Callisto Software Ltd
    Invoice #88213
    Invoice date: August 3, 2026
    Due date: September 2, 2026
    VAT ID IE9825613N
    Bill to: Theo Benoit, FR12812345678

    Team plan subscription · monthly	€29.00
    Subtotal	€29.00
    VAT (0%) — Reverse charge, article 196 of Directive 2006/112/EC	€0.00
    Amount due	€29.00
    TXT);

    expect($reading->supplier?->value)->toBe('Callisto Software Ltd')
        ->and($reading->spentOn?->value->toDateString())->toBe('2026-08-03')
        ->and($reading->amountTtc?->value->amount)->toBe(2_900)
        ->and($reading->vat?->treatment)->toBe(ExpenseVatTreatment::ReverseChargeEu)
        ->and($reading->vat?->rateBp)->toBe(2_000)
        ->and($reading->vat?->confidence)->toBe(ReceiptFieldConfidence::High)
        ->and($reading->category)->toBe(ExpenseCategory::Software);
});

test('a reverse-charged invoice from outside the EU reads as autoliquidation hors UE', function (): void {
    $reading = readReceipt(<<<'TXT'
    Orvella Inc.
    548 Market Street, San Francisco, CA 94104, USA
    Receipt · 2026-07-28
    Cloud storage 2 TB	$9.99
    Total	$9.99
    Reverse charge: VAT to be accounted for by the customer.
    TXT);

    expect($reading->vat?->treatment)->toBe(ExpenseVatTreatment::ReverseChargeNonEu)
        ->and($reading->vat?->confidence)->toBe(ReceiptFieldConfidence::Medium)
        ->and($reading->spentOn?->value->toDateString())->toBe('2026-07-28')
        ->and($reading->amountTtc?->value->amount)->toBe(999)
        ->and($reading->amountTtc?->confidence)->toBe(ReceiptFieldConfidence::Medium);
});

test('a bare reverse-charge mention defaults to the EU with low confidence', function (): void {
    $vat = readReceipt("Studio Lorem\nTotal 120,00 €\nAutoliquidation de la TVA")->vat;

    expect($vat?->treatment)->toBe(ExpenseVatTreatment::ReverseChargeEu)
        ->and($vat?->confidence)->toBe(ReceiptFieldConfidence::Low);
});

test('the franchise mention reads as exempt', function (string $mention): void {
    $vat = readReceipt("Ateliers Ruche\nPrestation 300,00 €\n{$mention}")->vat;

    expect($vat?->treatment)->toBe(ExpenseVatTreatment::Exempt)
        ->and($vat?->rateBp)->toBe(0);
})->with([
    'TVA non applicable, art. 293 B du CGI',
    'VAT exempt',
    'TVA : 0 %',
]);

test('reads every French rate off its TVA line', function (string $line, int $rateBp): void {
    $vat = readReceipt("Lunaprint\n{$line}\nTotal TTC 100,00 €")->vat;

    expect($vat?->treatment)->toBe(ExpenseVatTreatment::Domestic)
        ->and($vat?->rateBp)->toBe($rateBp);
})->with([
    'twenty' => ['TVA 20 %', 2_000],
    'twenty with decimals' => ['TVA (20,00 %) 16,67 €', 2_000],
    'ten' => ['TVA à 10% : 9,09 €', 1_000],
    'five and a half' => ['TVA 5,5 % 5,21 €', 550],
    'two point one' => ['Taux de TVA 2.1%', 210],
    'rate before the word' => ['dont 20 % de TVA', 2_000],
    'english' => ['VAT 20% £16.67', 2_000],
]);

test('says nothing about the TVA when no mention settles it', function (): void {
    expect(readReceipt("Papeterie Lorem\nCarnet 4,50 €\nTotal 4,50 €")->vat)->toBeNull();
});

test('parses the amount however the receipt writes it', function (string $written, int $cents): void {
    expect(readReceipt("Lunaprint\nTotal TTC {$written}")->amountTtc?->value->amount)->toBe($cents);
})->with([
    'french' => ['1 234,56 €', 123_456],
    'french narrow spaces' => ["1\u{202F}234,56\u{00A0}€", 123_456],
    'french dotted thousands' => ['1.234,56 EUR', 123_456],
    'english' => ['€1,234.56', 123_456],
    'whole euros' => ['429 €', 42_900],
    'dollars' => ['$ 20.00', 2_000],
    'no currency, two decimals' => ['56,40', 5_640],
]);

test('prefers the TTC total over every other amount on the page', function (): void {
    $reading = readReceipt(<<<'TXT'
    Vesterhus Énergie
    Consommation 1 250 kWh
    Sous-total 180,00 €
    Remise 20,00 €
    Total HT 160,00 €
    TVA 20 % 32,00 €
    Montant TTC 192,00 €
    Acompte versé 500,00 €
    TXT);

    expect($reading->amountTtc?->value->amount)->toBe(19_200)
        ->and($reading->amountTtc?->confidence)->toBe(ReceiptFieldConfidence::High);
});

test('falls back to the largest priced amount when no line is a total', function (): void {
    $reading = readReceipt("Maison Vesterhus\nMenu du jour 18,50 €\nCafé 2,20 €");

    expect($reading->amountTtc?->value->amount)->toBe(1_850)
        ->and($reading->amountTtc?->confidence)->toBe(ReceiptFieldConfidence::Low)
        ->and($reading->category)->toBe(ExpenseCategory::Meal);
});

test('never reads a date, a quantity, a rate or an identifier as an amount', function (): void {
    expect(readReceipt("Lunaprint\nFacture 2026-0412 du 12.08.2026\nQuantité 3\nSIRET 812 345 678 00019\nRemise 20,00 %")->amountTtc)->toBeNull();
});

test('a spaced percentage on the total line is not the total', function (): void {
    expect(readReceipt("Lunaprint\nTotal TTC 2,20 € dont TVA 10,00 %")->amountTtc?->value->amount)->toBe(220);
});

test('a phone number is not a date', function (): void {
    expect(readReceipt("Maison Vesterhus\nTél. 04.12.24.35.46\nReçu du 13/08/2026 12:45")->spentOn?->value->toDateString())->toBe('2026-08-13');
});

test('reads the date from its label even when the due date shares the line', function (): void {
    $spentOn = readReceipt("Lunaprint\nDate de facture 12/08/2026 · Échéance 30/08/2026")->spentOn;

    expect($spentOn?->value->toDateString())->toBe('2026-08-12')
        ->and($spentOn?->confidence)->toBe(ReceiptFieldConfidence::High);
});

test('a bare « Date : » names the invoice date unless the line says otherwise', function (string $line, ?string $expected): void {
    expect(readReceipt("Lunaprint\n{$line}")->spentOn?->value->toDateString())->toBe($expected);
})->with([
    'bare label' => ['Date : 12/08/2026', '2026-08-12'],
    'due label' => ["Date d'échéance : 30/08/2026", null],
    'order label' => ['Date de la commande 10/08/2026', null],
]);

test('the invoice date outranks the order and delivery dates printed above it', function (): void {
    $reading = readReceipt("Facture\nDate de la commande 10/08/2026\nDate de livraison : 05/08/2026\nDate de la facture 12/08/2026");

    expect($reading->spentOn?->value->toDateString())->toBe('2026-08-12')
        ->and($reading->spentOn?->confidence)->toBe(ReceiptFieldConfidence::High);
});

test('the date closest to its label wins, whatever its spelling', function (): void {
    expect(readReceipt("Lunaprint\nInvoice date August 3, 2026 · Service 07/03/2026 - 08/02/2026")->spentOn?->value->toDateString())
        ->toBe('2026-08-03');
});

test('reads dates however the receipt writes them', function (string $written, string $expected): void {
    expect(readReceipt("Lunaprint\nÉmise le {$written}")->spentOn?->value->toDateString())->toBe($expected);
})->with([
    'slashes' => ['12/08/2026', '2026-08-12'],
    'dots' => ['12.08.2026', '2026-08-12'],
    'two-digit year' => ['12/08/26', '2026-08-12'],
    'iso' => ['2026-08-12', '2026-08-12'],
    'french words' => ['12 août 2026', '2026-08-12'],
    'french first' => ['1er août 2026', '2026-08-01'],
    'english day first' => ['12 Aug 2026', '2026-08-12'],
    'english month first' => ['August 12th, 2026', '2026-08-12'],
]);

test('without a label the earliest plausible date wins and the confidence drops', function (): void {
    $single = readReceipt("Lunaprint\nReçu du 12/08/2026");
    $several = readReceipt("Lunaprint\nRéglé le 10/08/2026\nImprimé le 12/08/2026");

    expect($single->spentOn?->value->toDateString())->toBe('2026-08-12')
        ->and($single->spentOn?->confidence)->toBe(ReceiptFieldConfidence::Medium)
        ->and($several->spentOn?->value->toDateString())->toBe('2026-08-10')
        ->and($several->spentOn?->confidence)->toBe(ReceiptFieldConfidence::Low);
});

test('ignores dates outside the window a receipt can carry', function (string $line): void {
    expect(readReceipt("Lunaprint\n{$line}")->spentOn)->toBeNull();
})->with([
    'in the future' => 'Reçu du 14/08/2026',
    'before the century' => 'Fondée en 12/03/1998',
]);

test('a marketplace invoice names its seller of record', function (): void {
    $reading = readReceipt("Facture\nLU-BIO-04\nAmazon EU S.à r.l. - 38 avenue John F. Kennedy, L-1855 Luxembourg\nVendu par Roborock (HK) Limited\nTotal à payer 1 299,00 €");

    expect($reading->supplier?->value)->toBe('Roborock (HK) Limited')
        ->and($reading->supplier?->confidence)->toBe(ReceiptFieldConfidence::High);
});

test('a company followed by its address on one line keeps only the company', function (): void {
    expect(readReceipt("Facture\nLU-BIO-04\nAmazon EU S.à r.l. - 38 avenue John F. Kennedy, L-1855 Luxembourg")->supplier?->value)
        ->toBe('Amazon EU S.à r.l.');
});

test('a code or a payment status is never the supplier', function (string $line): void {
    expect(readReceipt("Facture\n{$line}\nRéférence de paiement WMM67AIQCRAU7Q28")->supplier)->toBeNull();
})->with(['LU-BIO-04', 'Payé', 'FR62IUVK0AEUD']);

test('a date glued to its label or wrapped under it is still read', function (string $text): void {
    $reading = readReceipt($text);

    expect($reading->spentOn?->value->toDateString())->toBe('2026-07-22')
        ->and($reading->spentOn?->confidence)->toBe(ReceiptFieldConfidence::High);
})->with([
    'glued' => "Lunaprint\nDate de la commande 20.07.2026\nDate de la facture/Date de la livraison22.07.2026",
    'wrapped' => "Lunaprint\nDate de la commande 20.07.2026\nDate de la facture/Date de\nla livraison22.07.2026",
    'glued, in words' => "Lunaprint\nDate de la commande 20 juillet 2026\nDate de la facture/Date de la livraison22 juillet 2026",
]);

test('reads the rate from the row under a TVA table header', function (): void {
    $vat = readReceipt("Lunaprint\nTaux TVA Total HT TVA\n20 % 1 082,50 € 216,50 €\nTotal à payer 1 299,00 €")->vat;

    expect($vat?->treatment)->toBe(ExpenseVatTreatment::Domestic)
        ->and($vat?->rateBp)->toBe(2_000);
});

test('the shipping line is not the description', function (): void {
    expect(readReceipt("Lunaprint\nLivraison 0,00 € 0,00 €\nTotal 12,00 €")->description)->toBeNull();
});

test('the line under « Facturé à » is the client, not the supplier', function (): void {
    expect(readReceipt("Facture\nÉmise le 12/08/2026\nFacturé à\nThéo Benoit\n12 rue des Fjords\nNordlys Cloud SAS")->supplier?->value)
        ->toBe('Nordlys Cloud SAS');
});

test('a line runs through the patterns in bounded time however long it is', function (): void {
    $started = hrtime(true);
    readReceipt("Lunaprint\n".str_repeat('du 1 ', 20_000)."\n".str_repeat('from 1 ', 15_000));

    expect((hrtime(true) - $started) / 1e9)->toBeLessThan(1.0);
});

test('skips document words, coordinates and addresses when naming the supplier', function (): void {
    $reading = readReceipt(<<<'TXT'
    FACTURE
    N° 2026-0412
    www.lunaprint.example
    Lunaprint
    8 rue des Presses, 69001 Lyon
    TXT);

    expect($reading->supplier?->value)->toBe('Lunaprint')
        ->and($reading->supplier?->confidence)->toBe(ReceiptFieldConfidence::Low);
});

test('guesses the category from the words on the receipt', function (string $text, ?ExpenseCategory $category): void {
    expect(readReceipt("Studio Lorem\n{$text}")->category)->toBe($category);
})->with([
    'fuel' => ['Station · SP95 42,10 litres', ExpenseCategory::Fuel],
    'hotel' => ['Chambre double · 2 nuitées · taxe de séjour', ExpenseCategory::Hotel],
    'train' => ['Billet TGV Paris → Lyon · trajet aller', ExpenseCategory::Travel],
    'insurance' => ['Assurance RC Pro · cotisation annuelle', ExpenseCategory::Insurance],
    'equipment' => ['Écran 27" · clavier · souris', ExpenseCategory::Equipment],
    'phone' => ['Forfait mobile 5G · appels illimités', ExpenseCategory::Phone],
    'nothing' => ['Prestation de conseil', null],
]);

test('an empty text layer reads as nothing', function (): void {
    $reading = readReceipt("  \n\n ");

    expect($reading->textFound)->toBeFalse()
        ->and($reading->supplier)->toBeNull()
        ->and($reading->amountTtc)->toBeNull()
        ->and($reading->category)->toBeNull();
});
