<?php

declare(strict_types=1);

namespace App\Http\Clients\Controllers;

use App\Domain\Clients\Models\Client;
use App\Domain\Documents\Actions\DeleteDocument;
use App\Domain\Documents\Actions\UpdateDocumentCategory;
use App\Domain\Documents\Actions\UploadDocument;
use App\Domain\Documents\Data\DocumentData;
use App\Domain\Documents\Data\DocumentListData;
use App\Domain\Documents\Data\UpdateDocumentData;
use App\Domain\Documents\Data\UploadDocumentData;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ClientDocumentController extends Controller
{
    public function index(Client $client): JsonResponse
    {
        $documents = $client->media()
            ->where('collection_name', 'documents')
            ->latest()
            ->get()
            ->all();

        return response()->json(new DocumentListData(
            documents: array_values(DocumentData::collect($documents, 'array')),
        ));
    }

    public function store(UploadDocumentData $data, Client $client, UploadDocument $uploadDocument): JsonResponse
    {
        $document = $uploadDocument->handle($client, $data);

        return response()->json(DocumentData::from($document), 201);
    }

    public function update(UpdateDocumentData $data, Client $client, int $document, UpdateDocumentCategory $updateDocumentCategory): JsonResponse
    {
        $updated = $updateDocumentCategory->handle($this->documentOf($client, $document), $data);

        return response()->json(DocumentData::from($updated));
    }

    public function download(Client $client, int $document): StreamedResponse
    {
        $media = $this->documentOf($client, $document);

        return Storage::disk($media->disk)->download(
            $media->getPathRelativeToRoot(),
            $media->file_name,
            ['Cache-Control' => 'no-store'],
        );
    }

    public function destroy(Client $client, int $document, DeleteDocument $deleteDocument): Response
    {
        $deleteDocument->handle($this->documentOf($client, $document));

        return response()->noContent();
    }

    private function documentOf(Client $client, int $documentId): Media
    {
        return $client->media()
            ->where('collection_name', 'documents')
            ->whereKey($documentId)
            ->firstOrFail();
    }
}
