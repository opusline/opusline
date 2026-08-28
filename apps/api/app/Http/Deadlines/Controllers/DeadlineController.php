<?php

declare(strict_types=1);

namespace App\Http\Deadlines\Controllers;

use App\Domain\Deadlines\Actions\CompleteFiscalDeadline;
use App\Domain\Deadlines\Actions\ConfirmCalendarSubscription;
use App\Domain\Deadlines\Actions\InterruptCalendarSubscription;
use App\Domain\Deadlines\Actions\ListDeadlineBoard;
use App\Domain\Deadlines\Actions\MarkDeadlineRemindersRead;
use App\Domain\Deadlines\Actions\RegenerateCalendarToken;
use App\Domain\Deadlines\Actions\UncompleteFiscalDeadline;
use App\Domain\Deadlines\Actions\UpdateCalendarFeed;
use App\Domain\Deadlines\Data\CompleteFiscalDeadlineData;
use App\Domain\Deadlines\Data\UpdateCalendarFeedData;
use App\Domain\Deadlines\Enums\FiscalDeadlineKind;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;

/**
 * Every write answers with the recomputed screen rather than a 204: ticking one
 * deadline off moves the next one, the reminder feed and the badge at once.
 */
class DeadlineController extends Controller
{
    public function index(#[CurrentUser] User $user, ListDeadlineBoard $listDeadlineBoard): JsonResponse
    {
        return response()->json($listDeadlineBoard->handle($user));
    }

    public function storeCompletion(
        CompleteFiscalDeadlineData $data,
        #[CurrentUser] User $user,
        CompleteFiscalDeadline $completeFiscalDeadline,
        ListDeadlineBoard $listDeadlineBoard,
    ): JsonResponse {
        $completeFiscalDeadline->handle($user, $data->kind, $data->periodKey);

        return response()->json($listDeadlineBoard->handle($user), 201);
    }

    // Resolved by hand rather than by implicit enum binding: the container
    // tries to instantiate the enum instead of binding it here, so the explicit
    // tryFrom is what actually turns an unknown case into a 404.
    public function destroyCompletion(
        int $kind,
        string $periodKey,
        #[CurrentUser] User $user,
        UncompleteFiscalDeadline $uncompleteFiscalDeadline,
        ListDeadlineBoard $listDeadlineBoard,
    ): JsonResponse {
        $resolved = FiscalDeadlineKind::tryFrom($kind);

        abort_if($resolved === null, 404, __('deadlines.unknown_occurrence'));

        $uncompleteFiscalDeadline->handle($user, $resolved, $periodKey);

        return response()->json($listDeadlineBoard->handle($user));
    }

    public function storeRemindersRead(
        #[CurrentUser] User $user,
        MarkDeadlineRemindersRead $markDeadlineRemindersRead,
        ListDeadlineBoard $listDeadlineBoard,
    ): JsonResponse {
        $markDeadlineRemindersRead->handle($user->settingsOrFail());

        return response()->json($listDeadlineBoard->handle($user));
    }

    public function updateCalendarFeed(
        UpdateCalendarFeedData $data,
        #[CurrentUser] User $user,
        UpdateCalendarFeed $updateCalendarFeed,
        ListDeadlineBoard $listDeadlineBoard,
    ): JsonResponse {
        $updateCalendarFeed->handle($user->settingsOrFail(), $data);

        return response()->json($listDeadlineBoard->handle($user));
    }

    public function storeCalendarSubscription(
        #[CurrentUser] User $user,
        ConfirmCalendarSubscription $confirmCalendarSubscription,
        ListDeadlineBoard $listDeadlineBoard,
    ): JsonResponse {
        $confirmCalendarSubscription->handle($user->settingsOrFail());

        return response()->json($listDeadlineBoard->handle($user));
    }

    public function destroyCalendarSubscription(
        #[CurrentUser] User $user,
        InterruptCalendarSubscription $interruptCalendarSubscription,
        ListDeadlineBoard $listDeadlineBoard,
    ): JsonResponse {
        $interruptCalendarSubscription->handle($user->settingsOrFail());

        return response()->json($listDeadlineBoard->handle($user));
    }

    public function storeCalendarToken(
        #[CurrentUser] User $user,
        RegenerateCalendarToken $regenerateCalendarToken,
        ListDeadlineBoard $listDeadlineBoard,
    ): JsonResponse {
        $regenerateCalendarToken->handle($user->settingsOrFail());

        return response()->json($listDeadlineBoard->handle($user));
    }
}
