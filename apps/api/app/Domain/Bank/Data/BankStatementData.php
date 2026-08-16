<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Bank\Models\BankStatement;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;

class BankStatementData extends Data
{
    public function __construct(
        public int $id,
        public string $fileName,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $periodStart,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $periodEnd,
        public int $lineCount,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'Y-m-d')]
        public CarbonImmutable $importedAt,
        /** Suggestions raised by this statement's movements, whatever became of them. */
        public int $matchCount,
        public int $validatedMatchCount,
    ) {}

    public static function fromModel(BankStatement $statement, int $matchCount, int $validatedMatchCount): self
    {
        return new self(
            id: $statement->id,
            fileName: $statement->file_name,
            periodStart: $statement->period_start,
            periodEnd: $statement->period_end,
            lineCount: $statement->line_count,
            importedAt: $statement->created_at,
            matchCount: $matchCount,
            validatedMatchCount: $validatedMatchCount,
        );
    }
}
