<?php

declare(strict_types=1);

namespace App\Domain\Missions\Data;

use App\Domain\Missions\Enums\MissionStatus;
use App\Domain\Shared\Data\MoneyData;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

class UpdateMissionData extends Data
{
    public function __construct(
        public string $name,
        public MissionStatus $status,
        public ?MoneyData $rate = null,
        public ?string $endClientSlug = null,
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
            'status' => ['required', Rule::enum(MissionStatus::class)],
            'rate' => ['nullable', 'array'],
            'endClientSlug' => [
                'nullable',
                'string',
                Rule::exists('clients', 'slug')->where('user_id', auth()->id()),
            ],
            'startDate' => ['nullable', 'date_format:Y-m-d'],
            'endDate' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:startDate'],
        ];
    }
}
