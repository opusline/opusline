<?php

declare(strict_types=1);

use ComposerUnused\ComposerUnused\Configuration\Configuration;
use ComposerUnused\ComposerUnused\Configuration\NamedFilter;

/**
 * Two packages this application never names in a `use` statement, and never will:
 * they are wired by string, which no symbol scanner can follow.
 */
return static fn (Configuration $configuration): Configuration => $configuration
    // The server runtime. It is started by `artisan octane:start` in the compose
    // file and the production entrypoint, and configured in config/octane.php.
    ->addNamedFilter(NamedFilter::fromString('laravel/octane'))
    // The SPA's authentication. It is reached through the `auth:sanctum` guard on
    // every route file and its own config, never through its classes.
    ->addNamedFilter(NamedFilter::fromString('laravel/sanctum'));
