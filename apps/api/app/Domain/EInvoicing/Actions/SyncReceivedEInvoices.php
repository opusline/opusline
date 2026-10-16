<?php

declare(strict_types=1);

namespace App\Domain\EInvoicing\Actions;

use App\Domain\Documents\Actions\StoreMediaFile;
use App\Domain\EInvoicing\Data\EInvoiceSyncData;
use App\Domain\EInvoicing\Enums\EInvoicingError;
use App\Domain\EInvoicing\Models\EInvoicingConnection;
use App\Domain\EInvoicing\Platform\EInvoicingPlatformException;
use App\Domain\EInvoicing\Platform\ReceivedInvoice;
use App\Domain\EInvoicing\SuperPdp\SuperPdpClient;
use App\Domain\EInvoicing\SuperPdp\SuperPdpCredentials;
use App\Domain\EInvoicing\SuperPdp\SuperPdpPlatform;
use App\Domain\Expenses\Enums\ExpenseCategory;
use App\Domain\Expenses\Enums\ExpenseVatTreatment;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Expenses\Vat\DeclaredCa3Months;
use App\Domain\Shared\Money\Rate;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Reads the account's inbox on its plateforme agréée and records every
 * supplier invoice it holds as an expense, the invoice's own PDF filed as the
 * receipt. The structured part of the invoice fills the expense, so nothing
 * has to be read off the PDF; a later sync only moves the lifecycle status.
 *
 * The platform is asked outside the account lock, like the bank: its answer
 * can take seconds, and nothing is written until it has been read.
 */
class SyncReceivedEInvoices
{
    /**
     * Re-read on every sync: a status the buyer's side set after the last
     * read lands on an invoice the previous window already covered.
     */
    private const int OVERLAP_DAYS = 7;

    public function __construct(
        private readonly SuperPdpClient $client,
        private readonly StoreMediaFile $storeMediaFile,
    ) {}

    /**
     * @throws EInvoicingPlatformException
     */
    public function handle(User $user): EInvoiceSyncData
    {
        $connection = $user->eInvoicingConnection()->first();
        $credentials = SuperPdpCredentials::ofOrFail($connection);
        assert($connection instanceof EInvoicingConnection);

        if (! $connection->company_verified) {
            throw new EInvoicingPlatformException(EInvoicingError::CompanyUnverified, 'The platform has not verified the company yet.');
        }

        $settings = $user->settingsOrFail();
        $platform = new SuperPdpPlatform($this->client, $credentials);
        $since = $connection->last_synced_at?->subDays(self::OVERLAP_DAYS);

        try {
            $received = $platform->listReceivedInvoices($since);
        } catch (EInvoicingPlatformException $exception) {
            $connection->recordFailure($exception->reason)->save();

            throw $exception;
        }

        $imported = 0;
        $updated = 0;
        $skipped = 0;

        foreach ($received as $invoice) {
            $existing = $user->expenses()->withTrashed()->where('e_invoice_platform_id', $invoice->platformId)->first();

            if ($existing instanceof Expense) {
                $updated += $this->refreshStatus($existing, $invoice) ? 1 : 0;

                continue;
            }

            if ($invoice->currency !== $settings->currency->value) {
                $skipped++;

                continue;
            }

            try {
                $file = $platform->downloadReceivedInvoice($invoice->platformId);
            } catch (EInvoicingPlatformException $exception) {
                $connection->recordFailure($exception->reason)->save();

                throw $exception;
            }

            $this->record($user, $invoice, $file, $settings->today());
            $imported++;
        }

        $connection->recordSync()->save();

        return new EInvoiceSyncData(fetched: count($received), imported: $imported, updated: $updated, skipped: $skipped);
    }

    private function refreshStatus(Expense $expense, ReceivedInvoice $invoice): bool
    {
        if ($expense->e_invoice_status === $invoice->status) {
            return false;
        }

        $expense->forceFill(['e_invoice_status' => $invoice->status])->save();

        return true;
    }

    /**
     * The expense as the invoice states it: its own HT and TTC, the rate
     * derived from them, dated the day it was issued but never ahead of today.
     */
    private function record(User $user, ReceivedInvoice $invoice, string $file, CarbonImmutable $today): void
    {
        $path = tempnam(sys_get_temp_dir(), 'e-invoice-');

        if ($path === false) {
            throw new EInvoicingPlatformException(EInvoicingError::Unavailable, 'Could not stage the received invoice on disk.');
        }

        try {
            file_put_contents($path, $file);

            DB::transaction(function () use ($user, $invoice, $path, $today): void {
                $locked = User::lockRow($user->id);
                $spentOn = $invoice->issuedOn->greaterThan($today) ? $today : $invoice->issuedOn;

                $expense = $locked->expenses()->create([
                    'e_invoice_platform_id' => $invoice->platformId,
                    'e_invoice_status' => $invoice->status,
                    'supplier' => Str::limit($invoice->supplierName, 120, ''),
                    'category' => ExpenseCategory::Other,
                    'description' => Str::limit('N° '.$invoice->number, 255, ''),
                    'spent_on' => $spentOn,
                    'vat_claim_period' => DeclaredCa3Months::of($locked->id)->claimFor($spentOn->format('Y-m')),
                    'vat_treatment' => ExpenseVatTreatment::Domestic,
                    'vat_rate_bp' => $this->rateBp($invoice->amountHtCents, $invoice->amountTtcCents),
                    'pro_share_bp' => Rate::BASIS_POINTS,
                    'currency' => $invoice->currency,
                    'amount_ttc_cents' => $invoice->amountTtcCents,
                    'amount_ht_cents' => $invoice->amountHtCents,
                ]);

                $this->storeMediaFile->handle($expense, $path, $this->fileName($invoice), Expense::RECEIPT_COLLECTION);
            });
        } finally {
            @unlink($path);
        }
    }

    /** The rate the invoice's own amounts imply, in basis points; 0 when it carries no VAT. */
    private function rateBp(int $htCents, int $ttcCents): int
    {
        if ($htCents <= 0 || $ttcCents <= $htCents) {
            return 0;
        }

        return min(Rate::BASIS_POINTS, (int) round(($ttcCents - $htCents) * Rate::BASIS_POINTS / $htCents));
    }

    /** « Facture-LUN-2026-07.pdf »: the supplier's number, in the characters a file name keeps. */
    private function fileName(ReceivedInvoice $invoice): string
    {
        $number = trim((string) preg_replace('/[^A-Za-z0-9._-]+/', '-', $invoice->number), '-');

        return 'Facture-'.($number === '' ? $invoice->platformId : $number).'.pdf';
    }
}
