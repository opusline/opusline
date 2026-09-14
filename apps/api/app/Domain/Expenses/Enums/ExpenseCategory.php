<?php

declare(strict_types=1);

namespace App\Domain\Expenses\Enums;

enum ExpenseCategory: int
{
    case Equipment = 0;
    case Software = 1;
    case Internet = 2;
    case Phone = 3;
    case Electricity = 4;
    case Hosting = 5;
    case Travel = 6;
    case Meal = 7;
    case Hotel = 8;
    case Fuel = 9;
    case Insurance = 10;
    case Taxes = 11;
    case Other = 12;
}
