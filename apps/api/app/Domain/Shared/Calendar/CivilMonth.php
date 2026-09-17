<?php

declare(strict_types=1);

namespace App\Domain\Shared\Calendar;

/**
 * A civil month as `2026-08`, for the request fields that name one.
 *
 * The year is bounded rather than left to `\d{4}`: no return is ever filed for a
 * month outside 1900–2099.
 */
final readonly class CivilMonth
{
    public const string EXPRESSION = '/^(19|20)\d{2}-(0[1-9]|1[0-2])$/';

    /** The first day EXPRESSION accepts, for the date fields whose months must stay reachable. */
    public const string EARLIEST_DAY = '1900-01-01';
}
