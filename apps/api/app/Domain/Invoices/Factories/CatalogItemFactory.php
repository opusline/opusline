<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Factories;

use App\Domain\Invoices\Enums\LineUnit;
use App\Domain\Invoices\Models\CatalogItem;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CatalogItem>
 */
class CatalogItemFactory extends Factory
{
    #[\Override]
    protected $model = CatalogItem::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'label' => 'Journée de développement frontend',
            'detail' => 'React, TypeScript · au forfait jour',
            'unit' => LineUnit::Day,
            // Currency before the amount: the money cast writes it as a side effect.
            'currency' => 'EUR',
            'unit_price_cents' => 55_000,
            'vat_rate_bp' => 2000,
        ];
    }
}
