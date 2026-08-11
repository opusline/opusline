<?php

declare(strict_types=1);

namespace App\Http\Settings\Controllers;

use App\Domain\Settings\Actions\DeleteSignature;
use App\Domain\Settings\Actions\UploadSignature;
use App\Domain\Settings\Data\UploadSignatureData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SignatureController extends Controller
{
    public function store(UploadSignatureData $data, #[CurrentUser] User $user, UploadSignature $uploadSignature): Response
    {
        $uploadSignature->handle($user, $data);

        return response()->noContent();
    }

    public function show(#[CurrentUser] User $user): StreamedResponse
    {
        $signature = $user->media()->where('collection_name', 'signature')->first();

        abort_if(! $signature instanceof Media, 404);

        return Storage::disk($signature->disk)->response(
            $signature->getPathRelativeToRoot(),
            $signature->file_name,
            [
                'Content-Security-Policy' => "default-src 'none'",
                'Cache-Control' => 'no-store',
            ],
        );
    }

    public function destroy(#[CurrentUser] User $user, DeleteSignature $deleteSignature): Response
    {
        $deleteSignature->handle($user);

        return response()->noContent();
    }
}
