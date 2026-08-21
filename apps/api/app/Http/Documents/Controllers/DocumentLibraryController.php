<?php

declare(strict_types=1);

namespace App\Http\Documents\Controllers;

use App\Domain\Documents\Actions\ListDocumentLibrary;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

class DocumentLibraryController extends Controller
{
    public function index(#[CurrentUser] User $user, ListDocumentLibrary $listDocumentLibrary): JsonResponse
    {
        return response()->json($listDocumentLibrary->handle($user));
    }
}
