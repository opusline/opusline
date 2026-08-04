<?php

declare(strict_types=1);

namespace App\Http\Clients\Controllers;

use App\Domain\Clients\Actions\DeleteClientLogo;
use App\Domain\Clients\Actions\UploadClientLogo;
use App\Domain\Clients\Data\UploadClientLogoData;
use App\Domain\Clients\Models\Client;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ClientLogoController extends Controller
{
    public function store(UploadClientLogoData $data, Client $client, UploadClientLogo $uploadClientLogo): Response
    {
        $uploadClientLogo->handle($client, $data);

        return response()->noContent();
    }

    public function show(Client $client): StreamedResponse
    {
        $logo = $client->getFirstMedia('logo');

        abort_if(! $logo instanceof Media, 404);

        return Storage::disk($logo->disk)->response(
            $logo->getPathRelativeToRoot(),
            $logo->file_name,
            [
                // The CSP header neuters scripts in SVG logos opened directly.
                'Content-Security-Policy' => "default-src 'none'",
                // Private content must never be reused from a shared cache.
                'Cache-Control' => 'no-store',
            ],
        );
    }

    public function destroy(Client $client, DeleteClientLogo $deleteClientLogo): Response
    {
        $deleteClientLogo->handle($client);

        return response()->noContent();
    }
}
