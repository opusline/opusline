<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Documents;

use App\Domain\Clients\Models\Client;
use App\Domain\Invoices\Models\InvoiceLine;
use App\Domain\Invoices\Models\QuoteLine;
use App\Domain\Settings\Models\UserSettings;
use Cknow\Money\Money;
use Illuminate\Support\Collection;

/**
 * What stops an invoice or a quote from being issued, as one problem per field.
 * The two documents print the same parties and lines, so they share the rules;
 * each action words them in its own lang group (`issue_{problem}`).
 */
final class IssueReadiness
{
    /**
     * @param  Collection<int, InvoiceLine>|Collection<int, QuoteLine>  $lines
     * @return array<'lines'|'seller'|'buyer', string>
     */
    public static function problems(UserSettings $settings, Client $client, Collection $lines, Money $ht): array
    {
        $problems = [];

        if ($lines->isEmpty()) {
            $problems['lines'] = 'needs_lines';
        } elseif (! $ht->isPositive()) {
            $problems['lines'] = 'needs_positive_total';
        } elseif (! $settings->vat_regime->isLiable() && $lines->contains(static fn (InvoiceLine|QuoteLine $line): bool => $line->vat_rate_bp > 0)) {
            // The lines were priced under a regime the account has since left;
            // only the editor can re-derive them, so the draft goes back there.
            $problems['lines'] = 'needs_vat_rework';
        }

        if (blank($settings->trade_name) || blank($settings->company_address_line1) || blank($settings->company_city)
            || ($settings->hasFrenchFiscality() && blank($settings->siret))) {
            $problems['seller'] = 'needs_seller_identity';
        } elseif ($settings->hasFrenchFiscality() && $settings->vat_regime->isLiable() && blank($settings->vat_number)) {
            $problems['seller'] = 'needs_vat_number';
        }

        if (blank($client->billing_address_line1) || blank($client->billing_city)) {
            $problems['buyer'] = 'needs_buyer_address';
        }

        return $problems;
    }
}
