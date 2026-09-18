<?php

declare(strict_types=1);

namespace App\Http\Settings\Controllers;

use App\Domain\Bank\Actions\DeleteEnableBankingCredentials;
use App\Domain\Bank\Actions\SaveEnableBankingCredentials;
use App\Domain\Bank\Data\EnableBankingSettingsData;
use App\Domain\Bank\Data\SaveEnableBankingCredentialsData;
use App\Domain\Settings\Data\IntegrationsData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

class IntegrationsController extends Controller
{
    public function show(#[CurrentUser] User $user): JsonResponse
    {
        return response()->json($this->integrations($user));
    }

    public function saveEnableBanking(
        SaveEnableBankingCredentialsData $data,
        #[CurrentUser] User $user,
        SaveEnableBankingCredentials $saveEnableBankingCredentials,
    ): JsonResponse {
        $saveEnableBankingCredentials->handle($user, $data);

        return response()->json($this->integrations($user));
    }

    public function deleteEnableBanking(
        #[CurrentUser] User $user,
        DeleteEnableBankingCredentials $deleteEnableBankingCredentials,
    ): JsonResponse {
        $deleteEnableBankingCredentials->handle($user);

        return response()->json($this->integrations($user));
    }

    private function integrations(User $user): IntegrationsData
    {
        // The writes above went through a locked copy of the settings row.
        $user->load('settings');

        return new IntegrationsData(enableBanking: EnableBankingSettingsData::fromSettings($user->settingsOrFail()));
    }
}
