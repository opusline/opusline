<?php

declare(strict_types=1);

namespace App\Domain\Bank\EnableBanking;

use Carbon\CarbonImmutable;

final readonly class EnableBankingSession
{
    /**
     * @param  list<LinkedAccount>  $accounts
     */
    public function __construct(
        public string $id,
        public CarbonImmutable $validUntil,
        public array $accounts,
    ) {}
}
