<?php

declare(strict_types=1);

namespace App\Http\Cra\Controllers;

use App\Domain\Clients\Data\ClientData;
use App\Domain\Cra\Actions\AttachSignedCra;
use App\Domain\Cra\Actions\CreateCra;
use App\Domain\Cra\Actions\DeleteCra;
use App\Domain\Cra\Actions\DescribeCra;
use App\Domain\Cra\Actions\ListCras;
use App\Domain\Cra\Actions\RenderCraPdf;
use App\Domain\Cra\Actions\ReopenCra;
use App\Domain\Cra\Actions\ResetCraDays;
use App\Domain\Cra\Actions\SendCra;
use App\Domain\Cra\Actions\UpdateCraDays;
use App\Domain\Cra\Data\CraDetailData;
use App\Domain\Cra\Data\CreateCraData;
use App\Domain\Cra\Data\DownloadCraPdfData;
use App\Domain\Cra\Data\ListCrasData;
use App\Domain\Cra\Data\SendCraData;
use App\Domain\Cra\Data\UpdateCraDaysData;
use App\Domain\Cra\Data\UploadSignedCraData;
use App\Domain\Cra\Models\Cra;
use App\Domain\Documents\Actions\DownloadDocument;
use App\Domain\Documents\Enums\DocumentCategory;
use App\Domain\Missions\Data\MissionData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;
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
     * @throws HttpException<409>
     */
    public function send(SendCraData $data, Cra $cra, SendCra $sendCra): JsonResponse
    {
        return response()->json($this->detail($sendCra->handle($cra, $data)));
    }

    /**
     * @throws HttpException<409>
     */
    public function reopen(Cra $cra, ReopenCra $reopenCra): JsonResponse
    {
        return response()->json($this->detail($reopenCra->handle($cra)));
    }

    /**
     * @throws HttpException<409>
     */
    public function storeSignedDocument(UploadSignedCraData $data, Cra $cra, AttachSignedCra $attachSignedCra): JsonResponse
    {
        return response()->json($this->detail($attachSignedCra->handle($cra, $data)), 201);
    }

    /**
     * The document itself.
     *
     * A draft renders on the fly, so the preview always reflects the grid as it stands. Once
     * the CRA is issued the stored file is streamed instead: a re-download has to be the
     * document the client received, not a re-render against settings that may have moved.
     */
    public function pdf(DownloadCraPdfData $data, Cra $cra, RenderCraPdf $renderCraPdf, DownloadDocument $downloadDocument): Response|StreamedResponse
    {
        $cra->loadMissing('mission');
        $stored = $this->storedDocument($cra);

        if ($stored instanceof Media) {
            return $downloadDocument->handle($stored);
        }

        return response($renderCraPdf->handle($cra, $data->applySignature), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$renderCraPdf->fileName($cra).'"',
            'Cache-Control' => 'no-store',
        ]);
    }

    private function storedDocument(Cra $cra): ?Media
    {
        if (! $cra->status->isIssued()) {
            return null;
        }

        return $cra->documents(DocumentCategory::Cra)->latest()->first();
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
