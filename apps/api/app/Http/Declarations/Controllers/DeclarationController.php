<?php

declare(strict_types=1);

namespace App\Http\Declarations\Controllers;

use App\Domain\Declarations\Actions\SummarizeDeclarations;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

class DeclarationController extends Controller
{
    public function show(#[CurrentUser] User $user, SummarizeDeclarations $summarizeDeclarations): JsonResponse
    {
        return response()->json($summarizeDeclarations->handle($user));
    }
}
