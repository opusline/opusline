<?php

declare(strict_types=1);

namespace App\Http\Settings\Controllers;

use App\Domain\Settings\Actions\ReadBackupRecord;
use App\Domain\Settings\Data\InstanceData;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class InstanceController extends Controller
{
    public function show(ReadBackupRecord $readBackupRecord): JsonResponse
    {
        return response()->json(new InstanceData(
            version: config()->string('app.version'),
            database: config()->string('database.default'),
            backup: $readBackupRecord->handle(),
        ));
    }
}
