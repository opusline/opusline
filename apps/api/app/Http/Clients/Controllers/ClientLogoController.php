<?php

declare(strict_types=1);

namespace App\Http\Clients\Controllers;

use App\Domain\Clients\Actions\DeleteClientLogo;
use App\Domain\Clients\Actions\UploadClientLogo;
use App\Domain\Clients\Data\UploadClientLogoData;
use App\Domain\Clients\Models\Client;
use App\Http\Controllers\Controller;
use App\Http\Support\StreamsMedia;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ClientLogoController extends Controller
{
    use StreamsMedia;

    public function store(UploadClientLogoData $data, Client $client, UploadClientLogo $uploadClientLogo): Response
    {
        $uploadClientLogo->handle($client, $data);

        return response()->noContent();
    }

    public function show(Client $client): StreamedResponse
    {
        return $this->streamSingleFile($client, 'logo');
    }

    public function destroy(Client $client, DeleteClientLogo $deleteClientLogo): Response
    {
        $deleteClientLogo->handle($client);

        return response()->noContent();
    }
}
