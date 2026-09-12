<?php

declare(strict_types=1);

namespace App\Http\Expenses\Controllers;

use App\Domain\Expenses\Actions\ExtractReceiptFields;
use App\Domain\Expenses\Data\ReadReceiptData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

class ReceiptReadingController extends Controller
{
    public function __invoke(ReadReceiptData $data, #[CurrentUser] User $user, ExtractReceiptFields $extractReceiptFields): JsonResponse
    {
        return response()->json($extractReceiptFields->handle($user, $data->file));
    }
}
