<?php

declare(strict_types=1);

namespace App\Http\Cra\Controllers;

use App\Domain\Clients\Data\ClientData;
use App\Domain\Cra\Actions\CreateCra;
use App\Domain\Cra\Actions\DeleteCra;
use App\Domain\Cra\Actions\DescribeCra;
use App\Domain\Cra\Actions\ListCras;
use App\Domain\Cra\Actions\ResetCraDays;
use App\Domain\Cra\Actions\UpdateCraDays;
use App\Domain\Cra\Data\CraDetailData;
use App\Domain\Cra\Data\CreateCraData;
use App\Domain\Cra\Data\ListCrasData;
use App\Domain\Cra\Data\UpdateCraDaysData;
use App\Domain\Cra\Models\Cra;
use App\Domain\Missions\Data\MissionData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CraController extends Controller
{
    public function __construct(private readonly DescribeCra $describeCra) {}

    public function index(ListCrasData $data, #[CurrentUser] User $user, ListCras $listCras): JsonResponse
    {
        return response()->json($listCras->handle($user, $data));
    }

    public function store(CreateCraData $data, #[CurrentUser] User $user, CreateCra $createCra): JsonResponse
    {
        return response()->json($this->detail($createCra->handle($user, $data)), 201);
    }

    public function show(Cra $cra): JsonResponse
    {
        return response()->json($this->detail($cra));
    }

    /**
     * @throws HttpException<409>
     */
    public function updateDays(UpdateCraDaysData $data, Cra $cra, UpdateCraDays $updateCraDays): JsonResponse
    {
        return response()->json($this->detail($updateCraDays->handle($cra, $data)));
    }

    /**
     * @throws HttpException<409>
     */
    public function reset(Cra $cra, ResetCraDays $resetCraDays): JsonResponse
    {
        return response()->json($this->detail($resetCraDays->handle($cra)));
    }

    /**
     * @throws HttpException<409>
     */
    public function destroy(Cra $cra, DeleteCra $deleteCra): Response
    {
        $deleteCra->handle($cra);

        return response()->noContent();
    }

    /**
     * Fills in what the action did not already hydrate: Model::shouldBeStrict() turns a
     * missed eager load into an exception rather than a silent extra query, and
     * loadMissing keeps the relations a write path just wrote instead of re-querying
     * them.
     */
    private function detail(Cra $cra): CraDetailData
    {
        $cra->loadMissing(['days', 'mission.client']);

        return new CraDetailData(
            cra: $this->describeCra->handle($cra),
            client: ClientData::from($cra->mission->client),
            mission: MissionData::from($cra->mission),
            recipientName: $cra->mission->recipientName(),
        );
    }
}
