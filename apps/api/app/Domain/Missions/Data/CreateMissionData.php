<?php

declare(strict_types=1);

namespace App\Domain\Missions\Data;

use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Shared\Data\MoneyData;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

class CreateMissionData extends Data
{
    public function __construct(
        public string $name,
        public BillingMode $billingMode,
        public ?MoneyData $rate = null,
        public ?int $endClientId = null,
        public ?string $startDate = null,
        public ?string $endDate = null,
    ) {}

    /**
     * @return array<string, list<mixed>>
     */
    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:1', 'max:255'],
            'billingMode' => ['required', Rule::enum(BillingMode::class)],
            'rate' => ['nullable', 'array'],
            'endClientId' => [
                'nullable',
                'integer',
                Rule::exists('clients', 'id')->where('user_id', auth()->id()),
            ],
            'startDate' => ['nullable', 'date_format:Y-m-d'],
            'endDate' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:startDate'],
        ];
    }
}
