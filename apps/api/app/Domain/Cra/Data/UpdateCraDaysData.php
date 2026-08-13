<?php

declare(strict_types=1);

namespace App\Domain\Cra\Data;

use App\Domain\Cra\Models\CraDay;
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
     * `present` rather than the inferred `required`, because an empty array does not
     * satisfy `required` and clearing every day is a legitimate edit.
     *
     * The nested keys are spelled out because a rules() entry replaces every rule for
     * its property, and the request body's OpenAPI schema is built from the resolved
     * rules — leaving them out generated `days: string[]` and made the endpoint
     * untypeable from the client. Same reason CreateInvoiceData declares timeEntryIds.*.
     *
     * @return array<string, list<string>>
     */
    public static function rules(): array
    {
        return [
            'days' => ['present', 'array'],
            'days.*.date' => ['required', 'date_format:Y-m-d'],
            'days.*.dayFractionBp' => ['required', 'integer', 'between:1,'.CraDay::FULL_DAY_BP],
        ];
    }
}
