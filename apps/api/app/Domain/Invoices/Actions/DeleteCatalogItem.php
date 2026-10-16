<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Models\CatalogItem;

/** Nothing points back at a catalogue item: documents copied its values onto their own lines. */
class DeleteCatalogItem
{
    public function handle(CatalogItem $item): void
    {
        $item->delete();
    }
}
