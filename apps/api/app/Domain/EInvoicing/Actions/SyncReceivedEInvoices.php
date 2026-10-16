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
use Illuminate\Validation\ValidationException;

/**
 * Reads the account's inbox on its plateforme agréée and records every
 * supplier invoice it holds as an expense, the invoice's own file filed as
 * the receipt. The structured part of the invoice fills the expense, so
 * nothing has to be read off the file; a later sync only moves the
 * lifecycle status.
 *
 * The platform is asked outside the account lock, like the bank: its answers
 * can take seconds, and nothing is written until every file has been read.
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
        $files = [];

        try {
            $received = $platform->listReceivedInvoices($connection->last_synced_at?->subDays(self::OVERLAP_DAYS));
            $known = $this->knownExpenses($user, $received);
            $new = array_values(array_filter($received, static fn (ReceivedInvoice $invoice): bool => ! isset($known[$invoice->platformId])
                && $invoice->currency === $settings->currency->value));

            foreach ($new as $invoice) {
                $files[$invoice->platformId] = $this->stage($platform->downloadReceivedInvoice($invoice->platformId));
            }

            $imported = DB::transaction(fn (): int => $this->record($user, $new, $files, $settings->today()));
        } catch (EInvoicingPlatformException $exception) {
            $connection->recordFailure($exception->reason)->save();

            throw $exception;
        } finally {
            foreach ($files as $path) {
                @unlink($path);
            }
        }

        $updated = 0;

        foreach ($received as $invoice) {
            $updated += $this->refreshStatus($known[$invoice->platformId] ?? null, $invoice) ? 1 : 0;
        }

        $connection->recordSync()->save();

        return new EInvoiceSyncData(
            fetched: count($received),
            imported: $imported,
            updated: $updated,
            skipped: count($received) - count($known) - count($new),
        );
    }

    /**
     * The expenses already recorded for these invoices, deleted ones included:
     * a tombstone keeps its invoice out of the journal for good.
     *
     * @param  list<ReceivedInvoice>  $received
     * @return array<string, Expense>
     */
    private function knownExpenses(User $user, array $received): array
    {
        $ids = array_map(static fn (ReceivedInvoice $invoice): string => $invoice->platformId, $received);

        return $user->expenses()->withTrashed()->whereIn('e_invoice_platform_id', $ids)->get()
            ->mapWithKeys(static fn (Expense $expense): array => [(string) $expense->e_invoice_platform_id => $expense])
            ->all();
    }

    private function refreshStatus(?Expense $expense, ReceivedInvoice $invoice): bool
    {
        if (! $expense instanceof Expense || $expense->trashed() || $expense->e_invoice_status === $invoice->status) {
            return false;
        }

        $expense->forceFill(['e_invoice_status' => $invoice->status])->save();

        return true;
    }

    /**
     * Writes the new expenses under one account lock, re-checking each invoice
     * there: a manual read overlapping the nightly one must not insert twice.
     *
     * @param  list<ReceivedInvoice>  $invoices
     * @param  array<string, string>  $files  Each invoice's staged file, by platform id.
     *
     * @throws EInvoicingPlatformException
     */
    private function record(User $user, array $invoices, array $files, CarbonImmutable $today): int
    {
        if ($invoices === []) {
            return 0;
        }

        $locked = User::lockRow($user->id);
        $declared = DeclaredCa3Months::of($locked->id);
        $taken = $locked->expenses()->withTrashed()
            ->whereIn('e_invoice_platform_id', array_map(static fn (ReceivedInvoice $invoice): string => $invoice->platformId, $invoices))
            ->pluck('e_invoice_platform_id')
            ->flip()
            ->all();
        $imported = 0;

        foreach ($invoices as $invoice) {
            if (isset($taken[$invoice->platformId])) {
                continue;
            }

            $spentOn = $invoice->issuedOn->greaterThan($today) ? $today : $invoice->issuedOn;
            $expense = $locked->expenses()->create([
                'e_invoice_platform_id' => $invoice->platformId,
                'e_invoice_status' => $invoice->status,
                'supplier' => Str::limit($invoice->supplierName, 120, ''),
                'category' => ExpenseCategory::Other,
                'description' => Str::limit('N° '.$invoice->number, 255, ''),
                'spent_on' => $spentOn,
                'vat_claim_period' => $declared->claimFor($spentOn->format('Y-m')),
                'vat_treatment' => ExpenseVatTreatment::Domestic,
                'vat_rate_bp' => $this->rateBp($invoice->amountHtCents, $invoice->amountTtcCents),
                'pro_share_bp' => Rate::BASIS_POINTS,
                'currency' => $invoice->currency,
                'amount_ttc_cents' => $invoice->amountTtcCents,
                'amount_ht_cents' => $invoice->amountHtCents,
            ]);

            $this->file($expense, $files[$invoice->platformId], $invoice);
            $imported++;
        }

        return $imported;
    }

    /**
     * @throws EInvoicingPlatformException
     */
    private function file(Expense $expense, string $path, ReceivedInvoice $invoice): void
    {
        try {
            $this->storeMediaFile->handle($expense, $path, $this->fileName($invoice, $path), Expense::RECEIPT_COLLECTION);
        } catch (ValidationException $exception) {
            throw new EInvoicingPlatformException(EInvoicingError::Rejected, "The received file of invoice {$invoice->platformId} could not be filed.", $exception);
        }
    }

    /**
     * The downloaded bytes on disk, where medialibrary reads files from.
     *
     * @throws EInvoicingPlatformException
     */
    private function stage(string $file): string
    {
        $path = tempnam(sys_get_temp_dir(), 'e-invoice-');

        if ($path === false || file_put_contents($path, $file) !== strlen($file)) {
            throw new EInvoicingPlatformException(EInvoicingError::Unavailable, 'Could not stage the received invoice on disk.');
        }

        return $path;
    }

    /** The rate the invoice's own amounts imply, in basis points; 0 when it carries no VAT. */
    private function rateBp(int $htCents, int $ttcCents): int
    {
        if ($htCents <= 0 || $ttcCents <= $htCents) {
            return 0;
        }

        return min(Rate::BASIS_POINTS, (int) round(($ttcCents - $htCents) * Rate::BASIS_POINTS / $htCents));
    }

    /**
     * « Facture-LUN-2026-07.pdf »: the supplier's number in the characters a
     * file name keeps, with the extension the file really has — a received
     * original may be UBL or CII XML rather than a Factur-X PDF.
     */
    private function fileName(ReceivedInvoice $invoice, string $path): string
    {
        $number = trim((string) preg_replace('/[^A-Za-z0-9_-]+/', '-', $invoice->number), '-');
        $head = (string) file_get_contents($path, length: 8);

        return 'Facture-'.($number === '' ? $invoice->platformId : $number).(str_starts_with($head, '%PDF') ? '.pdf' : '.xml');
    }
}
