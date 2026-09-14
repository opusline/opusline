<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Schema;
use Laravel\Telescope\TelescopeServiceProvider;

test('telescope is not registered outside the local environment', function (): void {
    expect(app()->providerIsLoaded(TelescopeServiceProvider::class))->toBeFalse();
});

test('the telescope tables are not migrated outside the local environment', function (): void {
    expect(Schema::hasTable('telescope_entries'))->toBeFalse();
});
