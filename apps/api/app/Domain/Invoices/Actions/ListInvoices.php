<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\InvoiceClientTotalsData;
use App\Domain\Invoices\Data\ListInvoicesData;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Shared\Data\MoneyData;
use App\Domain\Shared\Database\DatePageCursor;
use App\Domain\Users\Models\User;
use Cknow\Money\Money;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ListInvoices
{
    /**
     * The ledger grows for the life of the account, so the list is windowed:
     * one cursor page per request, newest first. clientTotals() below is
     * page-independent by design, so the chips keep their meaning whatever
     * window is on screen.
     */
    public const int PAGE_SIZE = 100;

    /**
     * @return array{invoices: list<Invoice>, nextCursor: ?string}
     */
    public function handle(User $user, ListInvoicesData $data): array
    {
        $query = $user->invoices()->with(['client', 'mission']);

        if ($data->status instanceof InvoiceStatus) {
            $query->where('status', $data->status);
        }

        if ($data->clientId !== null) {
            $query->where('client_id', $data->clientId);
        }

        if ($data->missionId !== null) {
            $query->where('mission_id', $data->missionId);
        }

        if ($data->from !== null) {
            $query->where('issued_on', '>=', $data->from);
        }

        if ($data->to !== null) {
            $query->where('issued_on', '<=', $data->to);
        }

        if ($data->late !== null) {
            $accountToday = $user->settingsOrFail()->today()->toDateString();
            $overdue =
                /** @param Builder<Invoice> $builder */
                function (Builder $builder) use ($accountToday): void {
                    $builder
                        ->where('status', InvoiceStatus::Sent)
                        ->where('due_on', '<', $accountToday);
                };

            $data->late ? $query->where($overdue) : $query->whereNot($overdue);
        }

        /** @var list<Invoice> $invoices */
        [$invoices, $nextCursor] = DatePageCursor::window(
            $query,
            'issued_on',
            self::PAGE_SIZE,
            DatePageCursor::decode($data->cursor),
        );

        return ['invoices' => $invoices, 'nextCursor' => $nextCursor];
    }

    /**
     * The gross total each client's rows add up to, per scope chip, so the screen
     * only groups and orders — it never sums money itself.
     *
     * Summed over every invoice of the account, not the rows the list request
     * returned: the list accepts status/late/date filters, and totals derived
     * from a filtered page would quietly change meaning per request.
     *
     * @return list<InvoiceClientTotalsData>
     */
    public function clientTotals(User $user): array
    {
        $settings = $user->settingsOrFail();
        $currency = $settings->currency;

        /** @var Collection<int, object{client_id: int, all_cents: int|numeric-string, open_cents: int|numeric-string, late_cents: int|numeric-string, paid_cents: int|numeric-string, draft_cents: int|numeric-string}> $rows */
        $rows = $user->invoices()
            ->toBase()
            ->selectRaw(
                'client_id,
                SUM(amount_ttc_cents) as all_cents,
                SUM(CASE WHEN status = ? THEN amount_ttc_cents ELSE 0 END) as open_cents,
                SUM(CASE WHEN status = ? AND due_on < ? THEN amount_ttc_cents ELSE 0 END) as late_cents,
                SUM(CASE WHEN status = ? THEN amount_ttc_cents ELSE 0 END) as paid_cents,
                SUM(CASE WHEN status = ? THEN amount_ttc_cents ELSE 0 END) as draft_cents',
                [
                    InvoiceStatus::Sent->value,
                    InvoiceStatus::Sent->value,
                    $settings->today()->toDateString(),
                    InvoiceStatus::Paid->value,
                    InvoiceStatus::Draft->value,
                ],
            )
            ->groupBy('client_id')
            ->orderBy('client_id')
            ->get();

        $totals = [];

        foreach ($rows as $row) {
            $totals[] = new InvoiceClientTotalsData(
                clientId: (int) $row->client_id,
                all: new MoneyData((int) $row->all_cents, $currency),
                open: new MoneyData((int) $row->open_cents, $currency),
                late: new MoneyData((int) $row->late_cents, $currency),
                paid: new MoneyData((int) $row->paid_cents, $currency),
                draft: new MoneyData((int) $row->draft_cents, $currency),
            );
        }

        return $totals;
    }
}
