<?php

declare(strict_types=1);

namespace App\Domain\AccessTokens\Enums;

/**
 * What a personal access token may do. Sanctum stores the values on the token
 * and its abilities middleware compares them by name, so the backing value is
 * the ability itself rather than an integer.
 */
enum TokenAbility: string
{
    case ReadInvoices = 'invoices:read';
}
