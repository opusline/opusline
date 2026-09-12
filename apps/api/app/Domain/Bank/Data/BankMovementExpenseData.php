<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Expenses\Models\Expense;
use Spatie\LaravelData\Data;

class BankMovementExpenseData extends Data
{
    public function __construct(
        public int $id,
        public string $supplier,
    ) {}

    public static function fromModel(Expense $expense): self
    {
        return new self(id: $expense->id, supplier: $expense->supplier);
    }
}
