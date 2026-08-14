<?php

declare(strict_types=1);

namespace App\Domain\Shared\Concerns;

use App\Domain\Settings\Models\UserSettings;

/**
 * For model accessors that need the account's settings (timezone, workday).
 *
 * The authenticated user is preferred over the row's owner relation because
 * lists hydrate models in collections, where a lazy owner load per row would
 * be an N+1 strict-mode violation; ownership scoping guarantees the two are
 * the same account on every serialization path.
 */
trait ResolvesAccountSettings
{
    protected function accountSettings(): UserSettings
    {
        $owner = auth()->user() ?? $this->user;

        return $owner->settingsOrFail();
    }
}
