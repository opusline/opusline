<?php

declare(strict_types=1);

namespace App\Domain\Users\Data;

use App\Domain\Users\Models\User;
use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

class UpdateUserEmailData extends Data
{
    public function __construct(
        public string $email,
    ) {}

    /**
     * The same rules as registration. The account's own address counts as
     * taken on purpose: re-submitting it would cycle the remember-me cookies
     * and trusted browsers for a change that never happened.
     *
     * @return array<string, list<mixed>>
     */
    public static function rules(): array
    {
        return [
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)],
        ];
    }
}
