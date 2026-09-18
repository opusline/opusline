<?php

declare(strict_types=1);

namespace App\Domain\Bank\EnableBanking;

use App\Domain\Settings\Models\UserSettings;

final readonly class EnableBankingCredentials
{
    public function __construct(
        public string $applicationId,
        public string $privateKey,
    ) {}

    public static function of(UserSettings $settings): ?self
    {
        $applicationId = $settings->enable_banking_application_id;
        $privateKey = $settings->enable_banking_private_key;

        if ($applicationId === null || $privateKey === null) {
            return null;
        }

        return new self($applicationId, $privateKey);
    }

    public static function ofOrFail(UserSettings $settings): self
    {
        return self::of($settings) ?? abort(409, __('bank.sync_not_configured'));
    }
}
