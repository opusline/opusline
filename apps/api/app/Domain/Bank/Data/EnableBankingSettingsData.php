<?php

declare(strict_types=1);

namespace App\Domain\Bank\Data;

use App\Domain\Settings\Models\UserSettings;
use Spatie\LaravelData\Data;

/** The account's Enable Banking application, minus its private key, which never leaves the server. */
class EnableBankingSettingsData extends Data
{
    public function __construct(
        /** Null until the account saves an application. */
        public ?string $applicationId,
        /** Where the bank sends the browser back to: the application must list it among its redirect URLs. */
        public string $redirectUrl,
    ) {}

    public static function fromSettings(UserSettings $settings): self
    {
        return new self(
            applicationId: $settings->enable_banking_application_id,
            redirectUrl: config()->string('services.enable_banking.redirect_url'),
        );
    }
}
