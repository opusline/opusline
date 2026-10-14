<?php

declare(strict_types=1);

namespace App\Http\Settings\Controllers;

use App\Domain\Settings\Actions\DeleteCompanyLogo;
use App\Domain\Settings\Actions\UploadCompanyLogo;
use App\Domain\Settings\Data\UploadCompanyLogoData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Support\StreamsMedia;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CompanyLogoController extends Controller
{
    use StreamsMedia;

    public function store(UploadCompanyLogoData $data, #[CurrentUser] User $user, UploadCompanyLogo $uploadCompanyLogo): Response
    {
        $uploadCompanyLogo->handle($user, $data);

        return response()->noContent();
    }

    public function show(#[CurrentUser] User $user): StreamedResponse
    {
        return $this->streamSingleFile($user, 'company_logo');
    }

    public function destroy(#[CurrentUser] User $user, DeleteCompanyLogo $deleteCompanyLogo): Response
    {
        $deleteCompanyLogo->handle($user);

        return response()->noContent();
    }
}
