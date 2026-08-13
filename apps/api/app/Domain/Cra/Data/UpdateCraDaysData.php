<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class UpdateCraDaysData extends Data
{
    /**
     * @param  list<CraDayInputData>  $days  The whole grid, days not worked omitted.
     *                                       A full replacement, so removing a day is
     *                                       simply leaving it out.
     */
    public function __construct(
        #[DataCollectionOf(CraDayInputData::class)]
        public array $days,
    ) {}

    /**
     * Inference makes a non-nullable array `required`, and an empty array does not
     * satisfy `required` — clearing every day is a legitimate edit.
     *
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return [
            'days' => ['present', 'array'],
        ];
    }
}
