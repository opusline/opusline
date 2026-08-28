<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use App\Domain\Shared\Calendar\CivilMonth;
use App\Domain\Shared\Validation\AuthenticatedUserId;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\Constraints\WhereConstraint;

class CreateCraData extends Data
{
    public function __construct(
        #[IntegerType]
        #[Exists('missions', 'id', where: new WhereConstraint('user_id', new AuthenticatedUserId))]
        public int $missionId,
        #[StringType, Regex(CivilMonth::EXPRESSION)]
        public string $month,
    ) {}
}
