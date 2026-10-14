<?php

declare(strict_types=1);

namespace App\Http\Invoices\Controllers;

use App\Domain\Invoices\Actions\DeleteCatalogItem;
use App\Domain\Invoices\Actions\SaveCatalogItem;
use App\Domain\Invoices\Data\CatalogData;
use App\Domain\Invoices\Data\CatalogItemData;
use App\Domain\Invoices\Data\CatalogItemInputData;
use App\Domain\Invoices\Models\CatalogItem;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class CatalogItemController extends Controller
{
    public function index(#[CurrentUser] User $user): CatalogData
    {
        $items = $user->catalogItems()->orderBy('label')->orderBy('id')->get();

        return new CatalogData(items: array_values($items->map(CatalogItemData::fromModel(...))->all()));
    }

    public function store(CatalogItemInputData $data, #[CurrentUser] User $user, SaveCatalogItem $saveCatalogItem): JsonResponse
    {
        return response()->json(CatalogItemData::fromModel($saveCatalogItem->handle($user, $data)), 201);
    }

    public function update(CatalogItemInputData $data, CatalogItem $catalogItem, #[CurrentUser] User $user, SaveCatalogItem $saveCatalogItem): CatalogItemData
    {
        return CatalogItemData::fromModel($saveCatalogItem->handle($user, $data, $catalogItem));
    }

    public function destroy(CatalogItem $catalogItem, DeleteCatalogItem $deleteCatalogItem): Response
    {
        $deleteCatalogItem->handle($catalogItem);

        return response()->noContent();
    }
}
