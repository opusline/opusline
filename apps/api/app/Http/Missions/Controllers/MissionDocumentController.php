<?php

declare(strict_types=1);

namespace App\Http\Missions\Controllers;

use App\Domain\Clients\Models\Client;
use App\Domain\Documents\Actions\DeleteDocument;
use App\Domain\Documents\Actions\UpdateDocumentCategory;
use App\Domain\Documents\Actions\UploadDocument;
use App\Domain\Documents\Data\DocumentData;
use App\Domain\Documents\Data\DocumentListData;
use App\Domain\Documents\Data\UpdateDocumentData;
use App\Domain\Documents\Data\UploadDocumentData;
use App\Domain\Missions\Models\Mission;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MissionDocumentController extends Controller
{
    public function index(Client $client, Mission $mission): JsonResponse
    {
        $documents = $mission->media()
            ->where('collection_name', 'documents')
            ->get()
            ->concat(
                $client->media()
                    ->where('collection_name', 'documents')
                    ->get()
                    ->all(),
            )
            ->sortByDesc('created_at')
            ->values()
            ->all();

        return response()->json(new DocumentListData(
            documents: array_values(DocumentData::collect($documents, 'array')),
        ));
    }

    public function store(UploadDocumentData $data, Client $client, Mission $mission, UploadDocument $uploadDocument): JsonResponse
    {
        $document = $uploadDocument->handle($mission, $data);

        return response()->json(DocumentData::from($document), 201);
    }

    public function update(UpdateDocumentData $data, Client $client, Mission $mission, int $document, UpdateDocumentCategory $updateDocumentCategory): JsonResponse
    {
        $updated = $updateDocumentCategory->handle($this->documentOf($mission, $document), $data);

        return response()->json(DocumentData::from($updated));
    }

    public function download(Client $client, Mission $mission, int $document): StreamedResponse
    {
        $media = $this->documentOf($mission, $document);

        return Storage::disk($media->disk)->download(
            $media->getPathRelativeToRoot(),
            $media->file_name,
            ['Cache-Control' => 'no-store'],
        );
    }

    public function destroy(Client $client, Mission $mission, int $document, DeleteDocument $deleteDocument): Response
    {
        $deleteDocument->handle($this->documentOf($mission, $document));

        return response()->noContent();
    }

    private function documentOf(Mission $mission, int $documentId): Media
    {
        return $mission->media()
            ->where('collection_name', 'documents')
            ->whereKey($documentId)
            ->firstOrFail();
    }
}
