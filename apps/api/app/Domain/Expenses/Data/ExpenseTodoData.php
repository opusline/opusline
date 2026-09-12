<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Data;

use App\Domain\Expenses\Enums\ExpenseTodoKind;
use App\Domain\Shared\Data\MoneyData;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

/** One card of the « À traiter » rail; which ids are set follows the kind. */
class ExpenseTodoData extends Data
{
    public function __construct(
        public ExpenseTodoKind $kind,
        public ?int $expenseId,
        public ?int $subscriptionId,
        public ?int $bankMovementId,
        public string $label,
        public MoneyData $amount,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $date,
    ) {}
}
