<?php

declare(strict_types=1);

namespace App\Domain\Settings\Factories;

use App\Domain\Settings\Enums\FiscalDeadlineKind;
use App\Domain\Settings\Models\FiscalDeclaration;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FiscalDeclaration>
 */
class FiscalDeclarationFactory extends Factory
{
    protected $model = FiscalDeclaration::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'kind' => FiscalDeadlineKind::Urssaf,
            'period' => '2026-07',
            'filed_on' => CarbonImmutable::today(),
            // Currency first: MoneyIntegerCast reads it when writing the amount.
            'currency' => 'EUR',
            'declared_amount_cents' => null,
        ];
    }
}
