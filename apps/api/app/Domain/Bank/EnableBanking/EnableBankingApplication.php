<?php

declare(strict_types=1);

namespace App\Domain\Bank\EnableBanking;

final readonly class EnableBankingApplication
{
    /**
     * @param  list<string>  $redirectUrls
     */
    public function __construct(
        public array $redirectUrls,
        /** A restricted application stays inactive until its owner links an account in Enable Banking's portal. */
        public bool $isActive,
    ) {}

    public function allowsRedirectTo(string $url): bool
    {
        return array_any($this->redirectUrls, fn (string $allowed): bool => rtrim($allowed, '/') === rtrim($url, '/'));
    }
}
