<?php

declare(strict_types=1);

namespace App\Http\Declarations\Controllers;

use App\Domain\Deadlines\Actions\ClearFiscalDeadlinePayment;
use App\Domain\Deadlines\Actions\CompleteFiscalDeadline;
use App\Domain\Deadlines\Actions\RecordFiscalDeadlinePayment;
use App\Domain\Deadlines\Actions\UncompleteFiscalDeadline;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Declarations\Actions\SummarizeDeclarations;
use App\Domain\Declarations\Data\CompleteDeclarationData;
use App\Domain\Declarations\Data\SummarizeDeclarationsData;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

/**
 * Every write answers with the recomputed screen for the month it was sent
 * from: a tick moves the block's footer, the history row and — for a CA3 —
 * the statuses the journal reads.
 */
class DeclarationController extends Controller
{
    public function __construct(private readonly SummarizeDeclarations $summarizeDeclarations) {}

    public function show(SummarizeDeclarationsData $data, #[CurrentUser] User $user): JsonResponse
    {
        return response()->json($this->summarizeDeclarations->handle($user, $data));
    }

    public function storeCompletion(
        CompleteDeclarationData $data,
        #[CurrentUser] User $user,
        CompleteFiscalDeadline $completeFiscalDeadline,
    ): JsonResponse {
        $screen = $this->summarizeDeclarations->handleAfter(
            $user,
            new SummarizeDeclarationsData($data->period),
            fn () => $completeFiscalDeadline->handle($user, $data->kind, $data->periodKey),
        );

        return response()->json($screen, 201);
    }

    public function destroyCompletion(
        int $kind,
        string $periodKey,
        SummarizeDeclarationsData $data,
        #[CurrentUser] User $user,
        UncompleteFiscalDeadline $uncompleteFiscalDeadline,
    ): JsonResponse {
        $screen = $this->summarizeDeclarations->handleAfter($user, $data, fn () => $uncompleteFiscalDeadline->handle($user, $this->kind($kind), $periodKey));

        return response()->json($screen);
    }

    public function storePayment(
        int $kind,
        string $periodKey,
        SummarizeDeclarationsData $data,
        #[CurrentUser] User $user,
        RecordFiscalDeadlinePayment $recordFiscalDeadlinePayment,
    ): JsonResponse {
        $screen = $this->summarizeDeclarations->handleAfter($user, $data, fn () => $recordFiscalDeadlinePayment->handle($user, $this->kind($kind), $periodKey));

        return response()->json($screen, 201);
    }

    public function destroyPayment(
        int $kind,
        string $periodKey,
        SummarizeDeclarationsData $data,
        #[CurrentUser] User $user,
        ClearFiscalDeadlinePayment $clearFiscalDeadlinePayment,
    ): JsonResponse {
        $screen = $this->summarizeDeclarations->handleAfter($user, $data, fn () => $clearFiscalDeadlinePayment->handle($user, $this->kind($kind), $periodKey));

        return response()->json($screen);
    }

    // Not an implicit enum binding: the container tries to instantiate the
    // enum instead of binding it, so this tryFrom is what turns an unknown
    // case into a 404 (same as DeadlineController::destroyCompletion).
    private function kind(int $kind): FiscalDeadlineKind
    {
        $resolved = FiscalDeadlineKind::tryFrom($kind);

        abort_if($resolved === null, 404, __('deadlines.unknown_occurrence'));

        return $resolved;
    }
}
