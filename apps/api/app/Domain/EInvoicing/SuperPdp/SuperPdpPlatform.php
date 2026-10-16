<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\SuperPdp;

use App\Domain\EInvoicing\Enums\EInvoicingError;
use App\Domain\EInvoicing\Enums\LifecycleStatus;
use App\Domain\EInvoicing\Platform\EInvoicingPlatform;
use App\Domain\EInvoicing\Platform\EInvoicingPlatformException;
use App\Domain\EInvoicing\Platform\ReceivedInvoice;
use App\Domain\EInvoicing\Platform\RecipientLookup;
use App\Domain\EInvoicing\Platform\SubmittedInvoice;
use Carbon\CarbonImmutable;
use Throwable;

/** Super PDP as one account's plateforme agréée. */
class SuperPdpPlatform implements EInvoicingPlatform
{
    /** One page of the inbox; the sync walks pages until the platform has no more. */
    private const int PAGE_SIZE = 100;

    /** Pages of one inbox walk. The cap stops a platform that keeps answering has_more. */
    private const int MAX_PAGES = 50;

    /** EN 16931 identifier schemes under which the value is a SIREN or a SIRET. */
    private const array FRENCH_REGISTRATION_SCHEMES = ['0002', '0009'];

    public function __construct(
        private readonly SuperPdpClient $client,
        private readonly SuperPdpCredentials $credentials,
    ) {}

    /**
     * What the settings page shows: the company, its environment, whether the
     * platform verified it and where the annuaire routes its invoices.
     *
     * @throws EInvoicingPlatformException
     */
    public function check(): SuperPdpConnectionCheck
    {
        // Until the platform verified the company, its routes answer 403: the
        // credentials still hold, so they are kept and checked again later.
        try {
            $verified = $this->client->isCompanyVerified($this->credentials);
            $company = $this->client->company($this->credentials);
        } catch (EInvoicingPlatformException $exception) {
            if ($exception->reason !== EInvoicingError::CompanyUnverified) {
                throw $exception;
            }

            return new SuperPdpConnectionCheck(null, null, null, false, null);
        }

        $address = $verified && $company->number !== null
            ? $this->client->directoryEntries($this->credentials, $company->number)[0] ?? null
            : null;

        return new SuperPdpConnectionCheck($company->name, $company->number, $company->environment, $verified, $address);
    }

    public function verifyConnection(): void
    {
        if (! $this->client->isCompanyVerified($this->credentials)) {
            throw new EInvoicingPlatformException(EInvoicingError::CompanyUnverified, 'Super PDP has not verified the company yet.');
        }
    }

    public function lookupRecipient(string $siren): RecipientLookup
    {
        $entries = $this->client->directoryEntries($this->credentials, $siren);

        return new RecipientLookup($siren, $entries !== [], null);
    }

    public function sendInvoice(string $facturX, string $recipientSiren): SubmittedInvoice
    {
        $invoice = $this->client->createInvoice($this->credentials, $facturX, $recipientSiren);
        $id = $invoice['id'] ?? null;

        if (! is_int($id) && ! is_string($id)) {
            throw new EInvoicingPlatformException(EInvoicingError::Unavailable, "Super PDP's deposit answer carries no id.");
        }

        return new SubmittedInvoice((string) $id, $this->lastStatus($invoice) ?? LifecycleStatus::Deposited);
    }

    public function invoiceStatus(string $platformId): LifecycleStatus
    {
        return $this->lastStatus($this->client->invoice($this->credentials, $platformId)) ?? LifecycleStatus::Deposited;
    }

    public function listReceivedInvoices(?CarbonImmutable $since = null): array
    {
        $received = [];
        $after = null;

        for ($pages = 0; $pages < self::MAX_PAGES; $pages++) {
            $page = $this->client->invoices($this->credentials, 'in', $after, self::PAGE_SIZE);
            $last = null;

            foreach ($page['data'] as $entry) {
                $id = $entry['id'] ?? null;

                if (! is_int($id) && ! is_string($id)) {
                    continue;
                }

                $last = (string) $id;
                $detail = $this->client->invoice($this->credentials, $last);
                $invoice = $this->receivedInvoice($detail);

                if ($invoice instanceof ReceivedInvoice && $this->changedSince($detail, $since)) {
                    $received[] = $invoice;
                }
            }

            // A page without ids, or one that repeats its cursor, cannot be walked past.
            if (! $page['hasMore'] || $last === null || $last === $after) {
                return $received;
            }

            $after = $last;
        }

        throw new EInvoicingPlatformException(EInvoicingError::Unavailable, 'Super PDP kept paginating past '.self::MAX_PAGES.' pages.');
    }

    public function downloadReceivedInvoice(string $platformId): string
    {
        return $this->client->download($this->credentials, $platformId);
    }

    public function reportStatus(string $platformId, LifecycleStatus $status, ?string $reason = null): void
    {
        $this->client->createInvoiceEvent($this->credentials, $platformId, $status->code(), $reason);
    }

    /**
     * Whether the platform touched the invoice since the given moment: its
     * latest event, or its own timestamps when it recorded none. Without a
     * moment, or without any date to compare, the invoice is kept.
     *
     * @param  array<array-key, mixed>  $invoice
     */
    private function changedSince(array $invoice, ?CarbonImmutable $since): bool
    {
        if (! $since instanceof CarbonImmutable) {
            return true;
        }

        $events = is_array($invoice['events'] ?? null) ? $invoice['events'] : [];
        $stamps = array_map(static fn (mixed $event): mixed => is_array($event) ? ($event['created_at'] ?? null) : null, $events);
        $latest = null;

        foreach ([...$stamps, $invoice['updated_at'] ?? null, $invoice['created_at'] ?? null] as $value) {
            $moment = $this->instant($value);

            if ($moment instanceof CarbonImmutable && (! $latest instanceof CarbonImmutable || $moment->greaterThan($latest))) {
                $latest = $moment;
            }
        }

        return ! $latest instanceof CarbonImmutable || $latest->greaterThanOrEqualTo($since);
    }

    private function instant(mixed $value): ?CarbonImmutable
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        try {
            return CarbonImmutable::parse($value);
        } catch (Throwable) {
            return null;
        }
    }

    /**
     * The most recent event the platform recorded, as a status Opusline knows.
     *
     * @param  array<array-key, mixed>  $invoice
     */
    private function lastStatus(array $invoice): ?LifecycleStatus
    {
        $events = is_array($invoice['events'] ?? null) ? $invoice['events'] : [];
        $status = null;

        foreach ($events as $event) {
            $code = is_array($event) ? ($event['status_code'] ?? null) : null;
            $status = LifecycleStatus::fromCode(is_string($code) ? $code : null) ?? $status;
        }

        return $status;
    }

    /**
     * The structured part of a received invoice; null when the platform did not
     * expand it, which #521 reports rather than drafting a blank expense.
     *
     * @param  array<array-key, mixed>  $invoice
     */
    private function receivedInvoice(array $invoice): ?ReceivedInvoice
    {
        $id = $invoice['id'] ?? null;
        $content = is_array($invoice['en_invoice'] ?? null) ? $invoice['en_invoice'] : null;

        if ((! is_int($id) && ! is_string($id)) || $content === null) {
            return null;
        }

        $seller = is_array($content['seller'] ?? null) ? $content['seller'] : [];
        $registration = is_array($seller['legal_registration_identifier'] ?? null) ? $seller['legal_registration_identifier'] : [];
        $totals = is_array($content['totals'] ?? null) ? $content['totals'] : $content;
        $number = $content['number'] ?? null;
        $issuedOn = $this->date($content['issue_date'] ?? null);
        $sellerName = $seller['name'] ?? null;

        if (! is_string($number) || ! is_string($sellerName) || ! $issuedOn instanceof CarbonImmutable) {
            return null;
        }

        $siren = in_array($registration['scheme'] ?? null, self::FRENCH_REGISTRATION_SCHEMES, true) ? $registration['value'] ?? null : null;
        $currency = $content['currency_code'] ?? 'EUR';

        return new ReceivedInvoice(
            platformId: (string) $id,
            supplierName: $sellerName,
            supplierSiren: is_string($siren) && $siren !== '' ? substr(preg_replace('/\D/', '', $siren) ?? '', 0, 9) : null,
            number: $number,
            issuedOn: $issuedOn,
            dueOn: $this->date($content['payment_due_date'] ?? null),
            amountHtCents: $this->cents($totals['total_without_vat'] ?? null),
            amountTtcCents: $this->cents($totals['total_with_vat'] ?? $totals['amount_due_for_payment'] ?? null),
            currency: is_string($currency) ? $currency : 'EUR',
            status: $this->lastStatus($invoice) ?? LifecycleStatus::Received,
        );
    }

    private function date(mixed $value): ?CarbonImmutable
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        try {
            return CarbonImmutable::parse($value)->startOfDay();
        } catch (Throwable) {
            return null;
        }
    }

    /** EN 16931 amounts travel as decimal strings, « 1234.56 »; stored as cents. */
    private function cents(mixed $value): int
    {
        if (is_int($value)) {
            return $value * 100;
        }

        if (! is_string($value) && ! is_float($value)) {
            return 0;
        }

        return (int) round((float) $value * 100);
    }
}
