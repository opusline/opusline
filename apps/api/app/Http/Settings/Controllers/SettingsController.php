<?php

declare(strict_types=1);

namespace App\Http\Settings\Controllers;

use App\Domain\Settings\Actions\RefreshOfficialRates;
use App\Domain\Settings\Actions\UpdateSettings;
use App\Domain\Settings\Data\SettingsData;
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
        return $this->respond($user->settings()->sole(), $user);
    }

    public function update(UpdateSettingsData $data, #[CurrentUser] User $user, UpdateSettings $updateSettings): JsonResponse
    {
        return $this->respond($updateSettings->handle($user->settings()->sole(), $data), $user);
    }

    /**
     * @throws HttpException<409>
     */
    public function refreshRates(#[CurrentUser] User $user, RefreshOfficialRates $refreshOfficialRates): JsonResponse
    {
        $settings = $user->settings()->sole();

        abort_if(! $settings->auto_rates, 409, __('settings.rates_manual'));

        return $this->respond($refreshOfficialRates->handle($settings, force: true), $user);
    }

    private function respond(UserSettings $settings, User $user): JsonResponse
    {
        return response()->json(
            SettingsData::fromModel($settings, $user->hasMedia('signature')),
        );
    }
}
