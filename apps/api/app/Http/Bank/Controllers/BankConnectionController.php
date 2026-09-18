<?php

declare(strict_types=1);

namespace App\Http\Bank\Controllers;

use App\Domain\Bank\Actions\ChooseBankAccount;
use App\Domain\Bank\Actions\CompleteBankConnection;
use App\Domain\Bank\Actions\DisconnectBankConnection;
use App\Domain\Bank\Actions\ListBankAspsps;
use App\Domain\Bank\Actions\StartBankConnection;
use App\Domain\Bank\Actions\SummarizeBankAccount;
use App\Domain\Bank\Actions\SyncBankConnection;
use App\Domain\Bank\Data\BankAspspData;
use App\Domain\Bank\Data\BankAspspListData;
use App\Domain\Bank\Data\BankAuthorizationData;
use App\Domain\Bank\Data\BankImportData;
use App\Domain\Bank\Data\ChooseBankAccountData;
use App\Domain\Bank\Data\CompleteBankConnectionData;
use App\Domain\Bank\Data\StartBankConnectionData;
use App\Domain\Bank\EnableBanking\PsuContext;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BankConnectionController extends Controller
{
    public function aspsps(#[CurrentUser] User $user, ListBankAspsps $listBankAspsps): JsonResponse
    {
        return response()->json(new BankAspspListData(
            aspsps: array_map(BankAspspData::fromAspsp(...), $listBankAspsps->handle($user)),
        ));
    }

    public function start(
        StartBankConnectionData $data,
        #[CurrentUser] User $user,
        StartBankConnection $startBankConnection,
    ): JsonResponse {
        return response()->json(new BankAuthorizationData(url: $startBankConnection->handle($user, $data)));
    }

    public function complete(
        CompleteBankConnectionData $data,
        #[CurrentUser] User $user,
        CompleteBankConnection $completeBankConnection,
        SummarizeBankAccount $summarizeBankAccount,
    ): JsonResponse {
        $completeBankConnection->handle($user, $data);

        return response()->json($summarizeBankAccount->handle($user));
    }

    public function chooseAccount(
        ChooseBankAccountData $data,
        #[CurrentUser] User $user,
        ChooseBankAccount $chooseBankAccount,
        SummarizeBankAccount $summarizeBankAccount,
    ): JsonResponse {
        $chooseBankAccount->handle($user, $data);

        return response()->json($summarizeBankAccount->handle($user));
    }

    public function sync(
        Request $request,
        #[CurrentUser] User $user,
        SyncBankConnection $syncBankConnection,
        SummarizeBankAccount $summarizeBankAccount,
    ): JsonResponse {
        $psu = new PsuContext(ipAddress: (string) $request->ip(), userAgent: (string) $request->userAgent());
        $synced = $syncBankConnection->handle($user, $psu);

        return response()->json(new BankImportData(
            lineCount: $synced['fetched'],
            importedCount: $synced['imported'],
            suggestionCount: $synced['suggestions'],
            account: $summarizeBankAccount->handle($user),
        ));
    }

    public function disconnect(
        #[CurrentUser] User $user,
        DisconnectBankConnection $disconnectBankConnection,
        SummarizeBankAccount $summarizeBankAccount,
    ): JsonResponse {
        $disconnectBankConnection->handle($user);

        return response()->json($summarizeBankAccount->handle($user));
    }
}
