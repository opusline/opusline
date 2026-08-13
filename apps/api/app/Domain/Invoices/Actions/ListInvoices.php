<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\ListInvoicesData;
use App\Domain\Invoices\Enums\InvoiceStatus;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;

class ListInvoices
{
    /**
     * @return array<int, Invoice>
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
            $overdue =
                /** @param Builder<Invoice> $builder */
                function (Builder $builder): void {
                    $builder
                        ->where('status', InvoiceStatus::Sent)
                        ->where('due_on', '<', CarbonImmutable::today()->toDateString());
                };

            $data->late ? $query->where($overdue) : $query->whereNot($overdue);
        }

        return $query
            ->orderByDesc('issued_on')
            ->orderByDesc('id')
            ->get()
            ->all();
    }
}
