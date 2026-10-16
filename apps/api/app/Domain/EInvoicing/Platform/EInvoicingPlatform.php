<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Platform;

use App\Domain\EInvoicing\Enums\LifecycleStatus;
use Carbon\CarbonImmutable;

/**
 * A plateforme agréée as Opusline talks to it, one adapter per platform.
 *
 * An adapter is built for one account's own credentials: every call runs as
 * that account on the platform, the way the bank sync runs as the account's
 * own Enable Banking application. Nothing here knows about Opusline models;
 * the actions of #520 and #521 translate between the two.
 *
 * Why an interface before any adapter exists: the choice of platform is a
 * decision Opusline must be able to revisit (docs/e-invoicing.md), and the
 * reform defines what every platform must offer, so the contract is the
 * reform's, not a vendor's.
 */
interface EInvoicingPlatform
{
    /**
     * Whether the credentials work and the account is enrolled on the platform.
     *
     * @throws EInvoicingPlatformException with what to fix
     */
    public function verifyConnection(): void;

    /**
     * Whether a company can be sent an electronic invoice, from the annuaire.
     *
     * @throws EInvoicingPlatformException
     */
    public function lookupRecipient(string $siren): RecipientLookup;

    /**
     * Hands an issued invoice to the platform. The file is the Factur-X PDF
     * Opusline archived at issue: the platform validates it and routes it.
     *
     * @throws EInvoicingPlatformException when the platform rejects the file
     */
    public function sendInvoice(string $facturX, string $recipientSiren): SubmittedInvoice;

    /**
     * The invoice's current status on the platform, as the buyer's side set it.
     *
     * @throws EInvoicingPlatformException
     */
    public function invoiceStatus(string $platformId): LifecycleStatus;

    /**
     * Supplier invoices addressed to the account, newest first, those changed
     * since the given moment when one is given.
     *
     * @return list<ReceivedInvoice>
     *
     * @throws EInvoicingPlatformException
     */
    public function listReceivedInvoices(?CarbonImmutable $since = null): array;

    /**
     * The Factur-X file of a received invoice, as bytes.
     *
     * @throws EInvoicingPlatformException
     */
    public function downloadReceivedInvoice(string $platformId): string;

    /**
     * Reports what the account did with a received invoice: approved it,
     * refused it, paid it. The reform makes some of these mandatory.
     *
     * @throws EInvoicingPlatformException
     */
    public function reportStatus(string $platformId, LifecycleStatus $status, ?string $reason = null): void;
}
