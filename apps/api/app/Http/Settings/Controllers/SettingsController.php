<?php

declare(strict_types=1);

namespace App\Http\Settings\Controllers;

use App\Domain\Settings\Actions\ChangeAccountCurrency;
use App\Domain\Settings\Actions\RefreshOfficialRates;
use App\Domain\Settings\Actions\UpdateSettings;
use App\Domain\Settings\Data\SettingsData;
use App\Domain\Settings\Data\UpdateSettingsCurrencyData;
use App\Domain\Settings\Data\UpdateSettingsData;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;

class SettingsController extends Controller
{
    public function show(#[CurrentUser] User $user): JsonResponse
    {
        return $this->respond($user->settingsOrFail(), $user);
    }

    public function update(UpdateSettingsData $data, #[CurrentUser] User $user, UpdateSettings $updateSettings): JsonResponse
    {
        $settings = $user->settingsOrFail();
        $ratesRefreshing = $updateSettings->handle($settings, $data);

        return $this->respond($settings, $user, $ratesRefreshing);
    }

    public function updateCurrency(UpdateSettingsCurrencyData $data, #[CurrentUser] User $user, ChangeAccountCurrency $changeAccountCurrency): JsonResponse
    {
        return $this->respond($changeAccountCurrency->handle($user->settingsOrFail(), $data), $user);
    }

    /**
     * @throws HttpException<409>
     */
    public function refreshRates(#[CurrentUser] User $user, RefreshOfficialRates $refreshOfficialRates): JsonResponse
    {
        $settings = $user->settingsOrFail();

        abort_if(! $settings->hasFrenchFiscality(), 409, __('settings.rates_foreign_country'));
        abort_if(! $settings->auto_rates, 409, __('settings.rates_manual'));

        return $this->respond($refreshOfficialRates->handle($settings, force: true), $user);
    }

    private function respond(UserSettings $settings, User $user, bool $ratesRefreshing = false): JsonResponse
    {
        return response()->json(SettingsData::fromModel(
            $settings,
            $user->hasMedia('signature'),
            $user->hasLockedCurrency(),
            $ratesRefreshing,
        ));
    }
}
