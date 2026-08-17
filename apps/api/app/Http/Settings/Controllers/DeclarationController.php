<?php

declare(strict_types=1);

namespace App\Http\Settings\Controllers;

use App\Domain\Settings\Actions\ListDeclarations;
use App\Domain\Settings\Actions\RecordDeclaration;
use App\Domain\Settings\Data\RecordDeclarationData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

class DeclarationController extends Controller
{
    public function index(#[CurrentUser] User $user, ListDeclarations $listDeclarations): JsonResponse
    {
        return response()->json($listDeclarations->handle($user));
    }

    /**
     * Answers with the whole ledger rather than the created row: filing a
     * return changes what the rest of the list still asks for.
     */
    public function store(
        RecordDeclarationData $data,
        #[CurrentUser] User $user,
        RecordDeclaration $recordDeclaration,
        ListDeclarations $listDeclarations,
    ): JsonResponse {
        $recordDeclaration->handle($user, $data);

        return response()->json($listDeclarations->handle($user), 201);
    }
}
