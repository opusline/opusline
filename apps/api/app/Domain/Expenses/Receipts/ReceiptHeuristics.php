<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Receipts;

use App\Domain\Bank\Actions\NormalizeBankText;
use App\Domain\Expenses\Data\ReceiptAmountFieldData;
use App\Domain\Expenses\Data\ReceiptDateFieldData;
use App\Domain\Expenses\Data\ReceiptSuggestionData;
use App\Domain\Expenses\Data\ReceiptTextFieldData;
use App\Domain\Expenses\Data\ReceiptVatFieldData;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Enums\ReceiptFieldConfidence;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Enums\Currency;
use Carbon\CarbonImmutable;

/**
 * Reads an expense off the text of a French or English receipt with plain
 * pattern matching: a labelled total beats a bare one, a labelled date beats
 * the earliest one, the TVA regime follows the legal mentions. Every field
 * says how it was found so the form can flag what deserves a look.
 */
final readonly class ReceiptHeuristics
{
    private const string WHOLE = '(?:\d{1,3}(?:[ .,]\d{3})+|\d+)';

    private const string AMOUNT = self::WHOLE.'(?:[.,]\d{2})?';

    private const string CURRENCY_MARK = '(?:€|eur\b|\$|£|usd\b|gbp\b|chf\b)';

    /** A priced figure: two decimals or a currency sign — a year or a quantity is neither. */
    private const string MONEY = self::WHOLE.'(?:[.,]\d{2}\s*'.self::CURRENCY_MARK.'?|\s*'.self::CURRENCY_MARK.')';

    private const string RATE = '(20|10|5[.,]50?|2[.,]10?)(?:[.,]00?)?\s*%';

    /** Lines whose amount is anything but the amount paid. */
    private const string NOT_A_TOTAL = '/\bht\b|hors\s*taxe|sous[- ]?total|subtotal|tva|vat|taxe|remise|discount|acompte|deposit|deja\s*(?:regle|paye)|already\s*paid/u';

    private const string TOTAL_TTC = '/total\s*ttc|toutes\s*taxes\s*comprises|tax(?:es)?\s*included|incl\.?\s*(?:vat|tax)|montant\s*ttc|ttc\s*(?:total|a\s*payer)|total\s*a\s*payer|net\s*a\s*payer|a\s*regler|amount\s*due|total\s*due|total\s*(?:incl|including)|grand\s*total|total\s*amount|balance\s*due|amount\s*paid|montant\s*paye|total\s*paye/u';

    private const string INVOICE_DATE = '/date\s*(?:de\s*)?(?:la\s*)?(?:facture|facturation|d\'?\s*emission|emission)|facture\s*du|emise?\s*le|invoice\s*date|date\s*(?:of\s*)?(?:invoice|issue)|issued?\s*(?:on|le)?\s*:?\s*\d/u';

    /** « Date : » names the invoice date only when nothing on the line says otherwise. */
    private const string BARE_DATE_LABEL = '/^date\b|\bdate\s*:/u';

    private const string NOT_THE_SPENT_DATE = '/echeance|\bdue\b|payer\s*avant|payable|paiement\s*avant|date\s*limite|valable|valid|expir|periode|period|\bdu\s+\d.{0,40}\bau\s+\d|\bfrom\b.{0,40}\bto\b|prochain|next|renouvel|renew|commande|order|livraison|delivery|expedi|ship/u';

    private const string REVERSE_CHARGE = '/auto-?liquidation|reverse[\s-]?charge|tva\s*due\s*par\s*le\s*preneur|accounted\s*for\s*by\s*the\s*(?:recipient|customer)|art(?:icle|\.)?\s*283|art(?:icle|\.)?\s*196/u';

    /** A non-French EU VAT number; the digit lookahead keeps « BON DE LIVRAISON » from reading as one. */
    private const string EU_VAT_ID = '/\b(?:AT|BE|BG|CY|CZ|DE|DK|EE|EL|ES|FI|HR|HU|IE|IT|LT|LU|LV|MT|NL|PL|PT|RO|SE|SI|SK)\s?(?=[A-Z]*\d)[0-9A-Z]{8,12}\b/';

    private const string NON_EU_SUPPLIER = '/\busa\b|u\.s\.a|united\s*states|delaware|california|\bllc\b|\binc\b|singapore|switzerland|suisse|united\s*kingdom|royaume-uni|\buk\b|\bgb\d{9}\b|australia|canada|japan|\bnew\s*york\b|san\s*francisco|seattle/u';

    private const string EXEMPT = '/tva\s*non\s*applicable|art(?:icle|\.)?\s*293\s*b|\b293b\b|exoneree?\s*de\s*tva|exoneration\s*de\s*tva|vat\s*exempt|exempt\s*from\s*vat|\bno\s*vat\b|not\s*subject\s*to\s*vat|(?:tva|vat)\s*:?\s*0\s*%/u';

    /** The line under one of these names the client, never the supplier. */
    private const string CLIENT_LABEL = '/client|customer|bill(?:ed)?\s*to|facture?\s*a\b|destinataire/u';

    /** What no supplier name looks like: document words, coordinates, identifiers, addresses. */
    private const string NOT_A_SUPPLIER = '/facture|invoice|\brecu\b|receipt|ticket|devis|quote|quotation|avoir|credit\s*note|\bpage\b|n°|\bno\.|\bnum|number|\bdate\b|total|siret|siren|\btva\b|\bvat\b|iban|\bbic\b|www\.|http|@|\brcs\b|capital|adresse|address|\btel\b|phone|client|customer|bill(?:ed)?\s*to|facture?\s*a\b|destinataire|montant|amount|\bref\b|reference|commande|order|\bcedex\b|\d{5}\b|\bemis|issued|payment|paiement|periode|period/u';

    private const array FRENCH_MONTHS = [
        'janvier' => 1, 'janv' => 1, 'fevrier' => 2, 'fevr' => 2, 'fev' => 2, 'mars' => 3, 'avril' => 4, 'avr' => 4, 'mai' => 5, 'juin' => 6,
        'juillet' => 7, 'juil' => 7, 'aout' => 8, 'septembre' => 9, 'sept' => 9, 'octobre' => 10, 'oct' => 10, 'novembre' => 11, 'nov' => 11, 'decembre' => 12, 'dec' => 12,
    ];

    private const array ENGLISH_MONTHS = [
        'january' => 1, 'jan' => 1, 'february' => 2, 'feb' => 2, 'march' => 3, 'mar' => 3, 'april' => 4, 'apr' => 4, 'may' => 5, 'june' => 6, 'jun' => 6,
        'july' => 7, 'jul' => 7, 'august' => 8, 'aug' => 8, 'september' => 9, 'sep' => 9, 'sept' => 9, 'october' => 10, 'oct' => 10, 'november' => 11, 'nov' => 11, 'december' => 12, 'dec' => 12,
    ];

    /** Keywords per category, folded; the first category wins a tie, so the specific ones lead. */
    private const array CATEGORY_KEYWORDS = [
        ExpenseCategory::Hosting->value => ['hebergement', 'hosting', 'serveur', 'server', 'vps', 'nom de domaine', 'domain', 'dns', 'cloud', 'stockage', 'storage', 'cdn'],
        ExpenseCategory::Fuel->value => ['carburant', 'essence', 'gazole', 'diesel', 'sp95', 'sp98', 'e10', 'fuel', 'litres'],
        ExpenseCategory::Hotel->value => ['hotel', 'nuitee', 'chambre', 'room', 'night', 'taxe de sejour'],
        ExpenseCategory::Meal->value => ['restaurant', 'repas', 'dejeuner', 'diner', 'menu', 'cafe', 'lunch', 'dinner', 'meal', 'brasserie', 'boulangerie', 'boisson'],
        ExpenseCategory::Travel->value => ['train', 'billet', 'voyage', 'trajet', 'flight', 'peage', 'taxi', 'vtc', 'navette', 'tgv', 'deplacement', 'parking'],
        ExpenseCategory::Insurance->value => ['assurance', 'insurance', 'rc pro', 'responsabilite civile', 'mutuelle', 'prevoyance'],
        ExpenseCategory::Taxes->value => ['cfe', 'impot', 'urssaf', 'dgfip', 'tresor public', 'cotisation'],
        ExpenseCategory::Electricity->value => ['electricite', 'electricity', 'kwh', 'energie', 'energy', 'gaz'],
        ExpenseCategory::Internet->value => ['fibre', 'adsl', 'box internet', 'internet', 'wifi'],
        ExpenseCategory::Phone->value => ['mobile', 'forfait', 'telephone', 'phone', 'carte sim', 'appels'],
        ExpenseCategory::Equipment->value => ['ecran', 'ordinateur', 'laptop', 'clavier', 'souris', 'monitor', 'keyboard', 'mouse', 'materiel', 'casque', 'imprimante', 'printer', 'disque', 'ssd', 'webcam', 'chargeur'],
        ExpenseCategory::Software->value => ['logiciel', 'software', 'licence', 'license', 'saas', 'abonnement', 'subscription'],
    ];

    /** @var list<string> */
    private array $lines;

    /** @var list<string> */
    private array $folded;

    private string $foldedText;

    /** No receipt line runs past this; a content stream that does is bounded before any pattern sees it. */
    private const int MAX_LINE_CHARS = 300;

    private const int MAX_TEXT_CHARS = 64 * 1024;

    private function __construct(string $text, private CarbonImmutable $today, private Currency $currency)
    {
        $lines = [];

        foreach (preg_split('/\R/u', mb_substr(mb_scrub($text), 0, self::MAX_TEXT_CHARS)) ?: [] as $line) {
            $line = trim(preg_replace('/[\s\x{00A0}\x{202F}]+/u', ' ', mb_substr($line, 0, self::MAX_LINE_CHARS)) ?? '');

            if ($line !== '') {
                $lines[] = $line;
            }
        }

        $this->lines = $lines;
        $this->folded = array_map($this->fold(...), $lines);
        $this->foldedText = implode("\n", $this->folded);
    }

    public static function suggest(string $text, CarbonImmutable $today, Currency $currency): ReceiptSuggestionData
    {
        $reading = new self($text, $today, $currency);

        return new ReceiptSuggestionData(
            textFound: $reading->lines !== [],
            supplier: $reading->supplier(),
            spentOn: $reading->spentOn(),
            amountTtc: $reading->amountTtc(),
            vat: $reading->vat(),
            description: $reading->description(),
            category: $reading->category(),
        );
    }

    /** Lowercase without accents, so every pattern is written once in plain ASCII. */
    private function fold(string $line): string
    {
        return strtr(mb_strtolower(NormalizeBankText::foldAccents($line)), ['’' => "'"]);
    }

    private function supplier(): ?ReceiptTextFieldData
    {
        foreach (array_slice($this->lines, 0, 10, preserve_keys: true) as $index => $line) {
            if (mb_strlen($line) > 60) {
                continue;
            }
            if (preg_match_all('/\p{L}/u', $line) < 3) {
                continue;
            }
            if (preg_match('/^\d/', $line) === 1) {
                continue;
            }
            if (preg_match(self::NOT_A_SUPPLIER, $this->folded[$index]) === 1) {
                continue;
            }
            if ($index > 0 && preg_match(self::CLIENT_LABEL, $this->folded[$index - 1]) === 1) {
                continue;
            }
            if ($this->amountsIn($this->folded[$index], markedOnly: false) !== []) {
                continue;
            }

            return new ReceiptTextFieldData(
                value: mb_strtoupper($line) === $line ? $this->titleCase($line) : $line,
                confidence: $index < 3 ? ReceiptFieldConfidence::Medium : ReceiptFieldConfidence::Low,
            );
        }

        return null;
    }

    /** « NORDLYS CLOUD SAS » reads as « Nordlys Cloud SAS »: short all-caps words are acronyms, not shouting. */
    private function titleCase(string $line): string
    {
        return preg_replace_callback('/\p{L}{4,}/u', fn (array $word): string => mb_convert_case($word[0], MB_CASE_TITLE), $line) ?? $line;
    }

    private function spentOn(): ?ReceiptDateFieldData
    {
        $candidates = [];

        foreach ($this->folded as $line) {
            $labelled = $this->labelledInvoiceDate($line);

            if ($labelled instanceof CarbonImmutable) {
                return new ReceiptDateFieldData($labelled, ReceiptFieldConfidence::High);
            }

            if (preg_match(self::NOT_THE_SPENT_DATE, $line) === 1) {
                continue;
            }

            foreach ($this->datesIn($line) as $date) {
                $candidates[$date->toDateString()] = $date;
            }
        }

        if ($candidates === []) {
            return null;
        }

        ksort($candidates);

        return new ReceiptDateFieldData(
            value: reset($candidates),
            confidence: count($candidates) === 1 ? ReceiptFieldConfidence::Medium : ReceiptFieldConfidence::Low,
        );
    }

    /**
     * The date following an invoice-date label, when that label comes before
     * any due-date one — « Date de facture 12/08/2026 · Échéance 30/08/2026 »
     * sits on one line on many PDFs.
     */
    private function labelledInvoiceDate(string $folded): ?CarbonImmutable
    {
        $hasDueLabel = preg_match(self::NOT_THE_SPENT_DATE, $folded, $due, PREG_OFFSET_CAPTURE) === 1;
        $hasLabel = preg_match(self::INVOICE_DATE, $folded, $label, PREG_OFFSET_CAPTURE) === 1
            || (! $hasDueLabel && preg_match(self::BARE_DATE_LABEL, $folded, $label, PREG_OFFSET_CAPTURE) === 1);

        if (! $hasLabel) {
            return null;
        }

        if ($hasDueLabel && $due[0][1] < $label[0][1]) {
            return null;
        }

        return $this->datesIn(substr($folded, $label[0][1]))[0] ?? null;
    }

    /**
     * Every plausible date on the line, in the order they are written.
     *
     * @return list<CarbonImmutable>
     */
    private function datesIn(string $folded): array
    {
        $french = implode('|', array_keys(self::FRENCH_MONTHS));
        $english = implode('|', array_keys(self::ENGLISH_MONTHS));
        $spellings = [
            ['/\b(?<day>\d{1,2})[\/.\-](?<month>\d{1,2})[\/.\-](?<year>\d{4}|\d{2})\b(?![\/.\-]?\d)/', null],
            ['/\b(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})\b/', null],
            ['/\b(?<day>\d{1,2})(?:er)?\s+(?<month>'.$french.')\.?\s+(?<year>\d{4})\b/', self::FRENCH_MONTHS],
            ['/\b(?<day>\d{1,2})(?:st|nd|rd|th)?\s+(?<month>'.$english.')\.?,?\s+(?<year>\d{4})\b/', self::ENGLISH_MONTHS],
            ['/\b(?<month>'.$english.')\.?\s+(?<day>\d{1,2})(?:st|nd|rd|th)?,?\s+(?<year>\d{4})\b/', self::ENGLISH_MONTHS],
        ];
        $dates = [];

        foreach ($spellings as [$pattern, $monthNames]) {
            preg_match_all($pattern, $folded, $matches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE);

            foreach ($matches as $match) {
                $day = (int) $match['day'][0];
                $month = $monthNames === null ? (int) $match['month'][0] : ($monthNames[$match['month'][0]] ?? 0);
                $year = strlen($match['year'][0]) === 2 ? 2000 + (int) $match['year'][0] : (int) $match['year'][0];

                if (! checkdate($month, $day, $year)) {
                    continue;
                }

                $date = CarbonImmutable::create($year, $month, $day)?->startOfDay();

                if ($date instanceof CarbonImmutable && $date->year >= 2000 && $date->lessThanOrEqualTo($this->today)) {
                    $dates[$match[0][1]] = $date;
                }
            }
        }

        ksort($dates);

        return array_values($dates);
    }

    private function amountTtc(): ?ReceiptAmountFieldData
    {
        $labelledTotal = null;
        $largest = null;

        foreach ($this->folded as $line) {
            $amounts = $this->amountsIn($line, markedOnly: false);

            if ($amounts === []) {
                continue;
            }

            $largestOnLine = max($amounts);

            if (preg_match(self::TOTAL_TTC, $line) === 1) {
                return $this->amount($largestOnLine, ReceiptFieldConfidence::High);
            }

            if ($labelledTotal === null && preg_match('/\btotal\b/', $line) === 1 && preg_match(self::NOT_A_TOTAL, $line) !== 1) {
                $labelledTotal = $largestOnLine;
            }

            $marked = $this->amountsIn($line, markedOnly: true);

            if ($marked !== []) {
                $largest = max($largest ?? 0, ...$marked);
            }
        }

        if ($labelledTotal !== null) {
            return $this->amount($labelledTotal, ReceiptFieldConfidence::Medium);
        }

        return $largest === null ? null : $this->amount($largest, ReceiptFieldConfidence::Low);
    }

    private function amount(int $cents, ReceiptFieldConfidence $confidence): ReceiptAmountFieldData
    {
        return new ReceiptAmountFieldData(new MoneyData($cents, $this->currency), $confidence);
    }

    /**
     * The amounts on a line, in cents. Marked ones carry a currency sign;
     * bare ones only count when written with two decimals, so quantities,
     * years and identifiers never read as money.
     *
     * @return list<int>
     */
    private function amountsIn(string $folded, bool $markedOnly): array
    {
        $marked = self::CURRENCY_MARK.'\s*('.self::AMOUNT.')|(?<![\d.,])('.self::AMOUNT.')\s*'.self::CURRENCY_MARK;
        $bare = '(?<![\d.,\/-])('.self::WHOLE.'[.,]\d{2})(?![\d.,\/%-]|\s*%)';

        preg_match_all('/(?|'.($markedOnly ? $marked : $marked.'|'.$bare).')/u', $folded, $matches, PREG_SET_ORDER);
        $cents = [];

        foreach ($matches as $match) {
            $parsed = $this->cents($match[1] ?? '');

            if ($parsed !== null && $parsed > 0 && $parsed <= MoneyData::MAX_AMOUNT) {
                $cents[] = $parsed;
            }
        }

        return $cents;
    }

    private function cents(string $raw): ?int
    {
        $compact = str_replace(' ', '', $raw);
        $hasFraction = preg_match('/^(.*)[.,](\d{2})$/', $compact, $parts) === 1;
        $units = preg_replace('/[.,]/', '', $hasFraction ? $parts[1] : $compact) ?? '';

        if ($units === '' || strlen($units) > 12) {
            return null;
        }

        return (int) $units * 100 + ($hasFraction ? (int) $parts[2] : 0);
    }

    private function vat(): ?ReceiptVatFieldData
    {
        if (preg_match(self::REVERSE_CHARGE, $this->foldedText) === 1) {
            return $this->reverseCharge();
        }

        if (preg_match('/(?:tva|vat|t\.v\.a\.?)[^\d\n]{0,12}?'.self::RATE.'/u', $this->foldedText, $rate) === 1
            || preg_match('/'.self::RATE.'\s*(?:de\s+)?(?:tva|vat)/u', $this->foldedText, $rate) === 1) {
            return new ReceiptVatFieldData(ExpenseVatTreatment::Domestic, $this->rateBp($rate[1]), ReceiptFieldConfidence::High);
        }

        if (preg_match(self::EXEMPT, $this->foldedText) === 1) {
            return new ReceiptVatFieldData(ExpenseVatTreatment::Exempt, 0, ReceiptFieldConfidence::High);
        }

        return null;
    }

    /**
     * The mention says the TVA is self-assessed; the supplier's identifiers
     * say from where. An EU VAT number settles it, a non-EU address nearly
     * does, and a bare mention defaults to the EU — where most of the SaaS
     * a freelance buys is billed from.
     */
    private function reverseCharge(): ReceiptVatFieldData
    {
        if (preg_match(self::EU_VAT_ID, implode("\n", $this->lines)) === 1) {
            return new ReceiptVatFieldData(ExpenseVatTreatment::ReverseChargeEu, 2_000, ReceiptFieldConfidence::High);
        }

        if (preg_match(self::NON_EU_SUPPLIER, $this->foldedText) === 1) {
            return new ReceiptVatFieldData(ExpenseVatTreatment::ReverseChargeNonEu, 2_000, ReceiptFieldConfidence::Medium);
        }

        return new ReceiptVatFieldData(ExpenseVatTreatment::ReverseChargeEu, 2_000, ReceiptFieldConfidence::Low);
    }

    private function rateBp(string $rate): int
    {
        return (int) round((float) str_replace(',', '.', $rate) * 100);
    }

    /** The first product line: text ending with an amount, below the supplier, that is no total nor tax line. */
    private function description(): ?ReceiptTextFieldData
    {
        foreach (array_slice($this->folded, 1, preserve_keys: true) as $index => $folded) {
            if (preg_match(self::NOT_A_TOTAL, $folded) === 1) {
                continue;
            }
            if (preg_match('/\b(?:total|date|siret|iban|facture|invoice)\b/', $folded) === 1) {
                continue;
            }
            if (preg_match('/\p{L}{3}/u', $folded) !== 1) {
                continue;
            }
            if (preg_match('/'.self::MONEY.'\s*$/u', $folded) !== 1) {
                continue;
            }
            $label = trim(preg_replace('/(?:\s+\d{1,4}\s*[x×]?)?(?:\s+(?:'.self::CURRENCY_MARK.'\s*'.self::AMOUNT.'|'.self::MONEY.'))+\s*$/iu', '', $this->lines[$index]) ?? '');

            if (preg_match_all('/\p{L}/u', $label) >= 3) {
                return new ReceiptTextFieldData(mb_substr($label, 0, 255), ReceiptFieldConfidence::Low);
            }
        }

        return null;
    }

    private function category(): ?ExpenseCategory
    {
        $best = null;
        $bestScore = 0;

        foreach (self::CATEGORY_KEYWORDS as $category => $keywords) {
            $score = count(array_filter($keywords, fn (string $keyword): bool => preg_match('/\b'.preg_quote($keyword, '/').'\b/u', $this->foldedText) === 1));

            if ($score > $bestScore) {
                $best = ExpenseCategory::from($category);
                $bestScore = $score;
            }
        }

        return $best;
    }
}
