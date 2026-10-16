<?php

declare(strict_types=1);

namespace App\Http\Settings\Controllers;

use App\Domain\Bank\Actions\DeleteEnableBankingCredentials;
use App\Domain\Bank\Actions\SaveEnableBankingCredentials;
use App\Domain\Bank\Data\EnableBankingSettingsData;
use App\Domain\Bank\Data\SaveEnableBankingCredentialsData;
use App\Domain\EInvoicing\Actions\CheckSuperPdpConnection;
use App\Domain\EInvoicing\Actions\ConnectSuperPdp;
use App\Domain\EInvoicing\Actions\DisconnectSuperPdp;
use App\Domain\EInvoicing\Data\EInvoicingSettingsData;
use App\Domain\EInvoicing\Data\SaveSuperPdpCredentialsData;
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

    public function saveSuperPdp(
        SaveSuperPdpCredentialsData $data,
        #[CurrentUser] User $user,
        ConnectSuperPdp $connectSuperPdp,
    ): JsonResponse {
        $connectSuperPdp->handle($user, $data);

        return response()->json($this->integrations($user));
    }

    public function checkSuperPdp(
        #[CurrentUser] User $user,
        CheckSuperPdpConnection $checkSuperPdpConnection,
    ): JsonResponse {
        $checkSuperPdpConnection->handle($user);

        return response()->json($this->integrations($user));
    }

    public function deleteSuperPdp(
        #[CurrentUser] User $user,
        DisconnectSuperPdp $disconnectSuperPdp,
    ): JsonResponse {
        $disconnectSuperPdp->handle($user);

        return response()->json($this->integrations($user));
    }

    private function integrations(User $user): IntegrationsData
    {
        // The writes above went through locked copies of the rows.
        $user->load(['settings', 'eInvoicingConnection']);

        return new IntegrationsData(
            enableBanking: EnableBankingSettingsData::fromSettings($user->settingsOrFail()),
            eInvoicing: EInvoicingSettingsData::fromConnection($user->eInvoicingConnection),
        );
    }
}
