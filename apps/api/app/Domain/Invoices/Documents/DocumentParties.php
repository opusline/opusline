<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Documents;

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Settings\Models\UserSettings;

/**
 * The seller and the buyer as a document prints them, frozen onto the invoice
 * when it is issued.
 *
 * @phpstan-type Party array{name: string, legalMention: ?string, siret: ?string, siren: ?string, vatNumber: ?string, tradeRegistry: ?string, addressLines: list<string>, email: ?string, phone: ?string, iban: ?string, bic: ?string, vatExempt: bool}
 */
final class DocumentParties
{
    /** @return Party */
    public static function seller(UserSettings $settings, Invoice $invoice): array
    {
        $isFrench = $settings->hasFrenchFiscality();

        return [
            'name' => (string) $settings->trade_name,
            // A micro-entrepreneur's name always carries « EI » (loi du 14 février 2022).
            'legalMention' => $isFrench ? 'EI' : null,
            'siret' => $settings->siret,
            'siren' => self::siren($settings->siret),
            'vatNumber' => $settings->vat_regime->isLiable() ? $settings->vat_number : null,
            'tradeRegistry' => $settings->trade_registry,
            'addressLines' => self::lines([
                $settings->company_address_line1,
                $settings->company_address_line2,
                trim($settings->company_postal_code.' '.$settings->company_city),
            ]),
            'email' => $invoice->show_email ? $settings->contact_email : null,
            'phone' => $settings->phone,
            'iban' => $invoice->show_iban ? $settings->iban : null,
            'bic' => $invoice->show_iban ? $settings->bic : null,
            'vatExempt' => ! $settings->vat_regime->isLiable(),
        ];
    }

    /** @return Party */
    public static function buyer(Client $client): array
    {
        return [
            'name' => $client->name,
            'legalMention' => null,
            'siret' => $client->siret,
            // Mandatory since September 2026 for a client registered in France.
            'siren' => self::siren($client->siret),
            'vatNumber' => $client->vat_number,
            'tradeRegistry' => null,
            'addressLines' => self::lines([
                $client->billing_address_line1,
                $client->billing_address_line2,
                trim($client->billing_postal_code.' '.$client->billing_city),
                $client->billing_country,
            ]),
            'email' => $client->billing_email,
            'phone' => null,
            'iban' => null,
            'bic' => null,
            'vatExempt' => false,
        ];
    }

    /** The first nine digits of a SIRET, the company's own identifier. */
    private static function siren(?string $siret): ?string
    {
        $digits = $siret === null ? '' : (string) preg_replace('/\D/', '', $siret);

        return strlen($digits) === 14 ? substr($digits, 0, 9) : null;
    }

    /**
     * @param  list<?string>  $lines
     * @return list<string>
     */
    private static function lines(array $lines): array
    {
        return array_values(array_filter($lines, static fn (?string $line): bool => $line !== null && trim($line) !== ''));
    }
}
