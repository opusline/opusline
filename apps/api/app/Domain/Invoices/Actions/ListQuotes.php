<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\ListQuotesData;
use App\Domain\Invoices\Enums\QuoteStatus;
use App\Domain\Invoices\Models\Quote;
use App\Domain\Users\Models\User;

/**
 * Newest first, whole: a freelance writes tens of quotes a year, so the list
 * is not windowed the way the invoice ledger is.
 */
class ListQuotes
{
    /**
     * @return list<Quote>
     */
    public function handle(User $user, ListQuotesData $data): array
    {
        $query = $user->quotes()->with(['client', 'mission']);

        if ($data->status instanceof QuoteStatus) {
            $query->where('status', $data->status);
        }

        if ($data->expired !== null) {
            $today = $user->settingsOrFail()->today()->toDateString();
            $query->where('status', QuoteStatus::Sent)->where('valid_until', $data->expired ? '<' : '>=', $today);
        }

        if ($data->clientId !== null) {
            $query->where('client_id', $data->clientId);
        }

        if ($data->missionId !== null) {
            $query->where('mission_id', $data->missionId);
        }

        return array_values($query->orderByDesc('issued_on')->orderByDesc('id')->get()->all());
    }
}
