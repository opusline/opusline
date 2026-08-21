<?php

declare(strict_types=1);

namespace App\Http\Documents\Controllers;

use App\Domain\Documents\Actions\DeleteDocument;
use App\Domain\Documents\Actions\DownloadDocument;
use App\Domain\Documents\Actions\UpdateDocumentCategory;
use App\Domain\Documents\Actions\UploadDocument;
use App\Domain\Documents\Data\DocumentData;
use App\Domain\Documents\Data\DocumentListData;
use App\Domain\Documents\Data\UpdateDocumentData;
use App\Domain\Documents\Data\UploadDocumentData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * The freelance's own administrative pieces — the ones a client asks for before signing.
 * They hang on the user rather than on a client or a mission.
 */
class UserDocumentController extends Controller
{
    public function index(#[CurrentUser] User $user): JsonResponse
    {
        return response()->json(new DocumentListData(
            documents: array_values(DocumentData::collect($user->documents, 'array')),
        ));
    }

    public function store(UploadDocumentData $data, #[CurrentUser] User $user, UploadDocument $uploadDocument): JsonResponse
    {
        $document = $uploadDocument->handle($user, $data);

        return response()->json(DocumentData::from($document), 201);
    }

    public function update(UpdateDocumentData $data, #[CurrentUser] User $user, int $document, UpdateDocumentCategory $updateDocumentCategory): JsonResponse
    {
        $updated = $updateDocumentCategory->handle($this->documentOf($user, $document), $data);

        return response()->json(DocumentData::from($updated));
    }

    public function download(#[CurrentUser] User $user, int $document, DownloadDocument $downloadDocument): StreamedResponse
    {
        return $downloadDocument->handle($this->documentOf($user, $document));
    }

    public function destroy(#[CurrentUser] User $user, int $document, DeleteDocument $deleteDocument): Response
    {
        $deleteDocument->handle($this->documentOf($user, $document));

        return response()->noContent();
    }

    private function documentOf(User $user, int $documentId): Media
    {
        return $user->documents()->whereKey($documentId)->firstOrFail();
    }
}
