<?php

declare(strict_types=1);

use Illuminate\Support\Arr;
use Illuminate\Support\Str;

/**
 * @return array<string, list<string>>
 */
function langCatalogKeys(string $locale): array
{
    $groups = [];

    foreach (glob(dirname(__DIR__, 2)."/lang/{$locale}/*.php") ?: [] as $file) {
        $keys = array_keys(Arr::dot(include $file));
        sort($keys);

        $groups[basename($file, '.php')] = $keys;
    }

    return $groups;
}

/**
 * Constructor property names of every request-bound Data class. Every class
 * under app/Domain/*\/Data is included by default; a class must opt out by
 * joining the response-only list below. The inversion is deliberate: a new
 * request DTO can only over-cover (a visible test failure asking for display
 * names), never silently fall outside the guard the way a name heuristic
 * would let it.
 *
 * @return list<string>
 */
function requestDataFields(): array
{
    $responseOnly = [
        'BankAccountData', 'BankBalanceData', 'BankImportData',
        'BankMatchData', 'BankMatchInvoiceData', 'BankMovementData',
        'BankMovementInvoiceData', 'BankProvisionData', 'BankProvisionsData',
        'BankStatementData', 'SignedMoneyData',
        'ClientData', 'ClientListData', 'ClientRevenueData',
        'ClientRevenueDetailData', 'ClientRevenueListData',
        'ClientWithMissionsData',
        'CraCountsData', 'CraData', 'CraDayData', 'CraDetailData',
        'CraListData', 'CraListItemData', 'DocumentData', 'DocumentListData',
        'FixedPriceBudgetData', 'FixedPriceConsumptionData',
        'InvoiceClientTotalsData', 'InvoiceCountsData', 'InvoiceData',
        'InvoiceDetailData', 'InvoiceEventData', 'InvoiceForecastData',
        'InvoiceListItemData', 'InvoiceOverdueData', 'InvoiceSummaryData',
        'InvoiceTodoBudgetData', 'InvoiceTodoData', 'InvoiceTodoOverdueData',
        'InvoiceTodoWorkData',
        'InvoiceTotalData', 'MissionData', 'MissionRevenueData', 'MoneyData',
        'MonthWorkloadData',
        'NextInvoiceNumberData', 'RevenueClientData', 'RevenueComparisonData',
        'RevenueData', 'RevenueMonthData', 'RevenueNetData', 'RevenueVatData',
        'SettingsData', 'TimeEntryData',
        'TimeEntryListData', 'TimerData', 'TimerStateData', 'UserData',
        'InvoiceListData',
    ];

    $fields = [];

    foreach (glob(dirname(__DIR__, 2).'/app/Domain/*/Data/*.php') ?: [] as $path) {
        $class = basename($path, '.php');

        if (in_array($class, $responseOnly, strict: true)) {
            continue;
        }

        $fqcn = 'App\\Domain\\'.basename(dirname($path, 2)).'\\Data\\'.$class;

        foreach ((new ReflectionClass($fqcn))->getConstructor()?->getParameters() ?? [] as $parameter) {
            $fields[$parameter->getName()] = true;
        }
    }

    return array_keys($fields);
}

test('every lang group carries the same keys in French and English', function (): void {
    expect(langCatalogKeys('fr'))->toBe(langCatalogKeys('en'));
});

test('every validated request field has a display name in both locales', function (string $locale): void {
    $fields = include dirname(__DIR__, 2)."/lang/{$locale}/fields.php";
    $stockAttributes = (include dirname(__DIR__, 2)."/lang/{$locale}/validation.php")['attributes'];

    $missing = array_values(array_filter(
        requestDataFields(),
        fn (string $field): bool => ! isset($fields[$field]) && ! isset($stockAttributes[Str::snake($field)]),
    ));

    expect($missing)->toBe([]);
})->with(['fr', 'en']);
