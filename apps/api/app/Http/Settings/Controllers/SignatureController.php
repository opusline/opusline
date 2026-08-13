<?php

declare(strict_types=1);

namespace App\Http\Settings\Controllers;

use App\Domain\Settings\Actions\DeleteSignature;
use App\Domain\Settings\Actions\UploadSignature;
use App\Domain\Settings\Data\UploadSignatureData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Support\StreamsMedia;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SignatureController extends Controller
{
    use StreamsMedia;

    public function store(UploadSignatureData $data, #[CurrentUser] User $user, UploadSignature $uploadSignature): Response
    {
        $uploadSignature->handle($user, $data);

        return response()->noContent();
    }

    public function show(#[CurrentUser] User $user): StreamedResponse
    {
        return $this->streamSingleFile($user, 'signature');
    }

    public function destroy(#[CurrentUser] User $user, DeleteSignature $deleteSignature): Response
    {
        $deleteSignature->handle($user);

        return response()->noContent();
    }
}
