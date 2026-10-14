<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\CatalogItemInputData;
use App\Domain\Invoices\Models\CatalogItem;
use App\Domain\Shared\Validation\AccountCurrency;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\DB;

/** Creates the item when none is given, updates it otherwise. */
class SaveCatalogItem
{
    public function handle(User $user, CatalogItemInputData $data, ?CatalogItem $item = null): CatalogItem
    {
        return DB::transaction(function () use ($user, $data, $item): CatalogItem {
            AccountCurrency::assertMatchesAccountUnderLock($user->id, $data->unitPrice);

            $attributes = [
                'label' => trim($data->label),
                'detail' => blank($data->detail) ? null : trim($data->detail),
                'unit' => $data->unit,
                // The money cast writes the currency column as a side effect,
                // so the currency goes first.
                'currency' => $data->unitPrice->currency->value,
                'unit_price_cents' => $data->unitPrice->toMoney(),
                'vat_rate_bp' => $data->vatRateBp,
            ];

            if (! $item instanceof CatalogItem) {
                return $user->catalogItems()->create($attributes);
            }

            $item->update($attributes);

            return $item;
        });
    }
}
