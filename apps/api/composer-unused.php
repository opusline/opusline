<?php

declare(strict_types=1);

use ComposerUnused\ComposerUnused\Configuration\Configuration;
use ComposerUnused\ComposerUnused\Configuration\NamedFilter;

/**
 * Packages this application never names in a `use` statement under an
 * autoloaded path, and never will: they are wired by string, or from a
 * directory the symbol scanner does not walk.
 */
return static fn (Configuration $configuration): Configuration => $configuration
    // The server runtime. It is started by `artisan octane:start` in the compose
    // file and the production entrypoint, and configured in config/octane.php.
    ->addNamedFilter(NamedFilter::fromString('laravel/octane'))
    // The one-time data operations. Its base class is extended only from the
    // `operations/` directory, which is not autoloaded, and its command runs
    // from the production entrypoint (`artisan operations:process`).
    ->addNamedFilter(NamedFilter::fromString('timokoerber/laravel-one-time-operations'));
