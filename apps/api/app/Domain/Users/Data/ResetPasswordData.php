<?php

declare(strict_types=1);

namespace App\Domain\Users\Data;

use Spatie\LaravelData\Data;

class ResetPasswordData extends Data
{
    public function __construct(
        public string $token,
        public string $email,
        public string $password,
    ) {}

    /**
     * @return array<string, list<mixed>>
     */
    public static function rules(): array
    {
        return [
            'token' => ['required', 'string'],
            'email' => ['required', 'string', 'email'],
            // A password set by a reset is held to the rules of one changed
            // from the settings: one list, so the two cannot drift.
            'password' => UpdateUserPasswordData::rules()['password'],
        ];
    }
}
