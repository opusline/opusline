<?php

declare(strict_types=1);

namespace App\Http\Timers\Controllers;

use App\Domain\TimeEntries\Data\TimeEntryData;
use App\Domain\Timers\Actions\DiscardTimer;
use App\Domain\Timers\Actions\FindRunningTimer;
use App\Domain\Timers\Actions\PauseTimer;
use App\Domain\Timers\Actions\ResumeTimer;
use App\Domain\Timers\Actions\StartTimer;
use App\Domain\Timers\Actions\StopTimer;
use App\Domain\Timers\Actions\TrimTimer;
use App\Domain\Timers\Actions\UpdateTimerNote;
use App\Domain\Timers\Data\StartTimerData;
use App\Domain\Timers\Data\StopTimerData;
use App\Domain\Timers\Data\TimerData;
use App\Domain\Timers\Data\TimerStateData;
use App\Domain\Timers\Data\TrimTimerData;
use App\Domain\Timers\Data\UpdateTimerData;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class TimerController extends Controller
{
    public function show(#[CurrentUser] User $user, FindRunningTimer $findRunningTimer): JsonResponse
    {
        $timer = $findRunningTimer->handle($user);

        return response()->json(new TimerStateData(
            timer: $timer instanceof RunningTimer ? TimerData::from($timer) : null,
            lastMissionId: $user->timeEntries()
                ->orderByDesc('date')
                ->orderByDesc('id')
                ->first(['mission_id'])?->mission_id,
        ));
    }

    /**
     * @throws HttpException<409>
     */
    public function store(StartTimerData $data, #[CurrentUser] User $user, StartTimer $startTimer): JsonResponse
    {
        $timer = $startTimer->handle($user, $data);

        return $this->timerResponse($timer, 201);
    }

    /**
     * @throws HttpException<404>
     */
    public function update(UpdateTimerData $data, #[CurrentUser] User $user, UpdateTimerNote $updateTimerNote): JsonResponse
    {
        $timer = $updateTimerNote->handle($user, $data);

        return $this->timerResponse($timer);
    }

    /**
     * @throws HttpException<404>
     */
    public function pause(#[CurrentUser] User $user, PauseTimer $pauseTimer): JsonResponse
    {
        $timer = $pauseTimer->handle($user);

        return $this->timerResponse($timer);
    }

    /**
     * @throws HttpException<404>
     */
    public function resume(#[CurrentUser] User $user, ResumeTimer $resumeTimer): JsonResponse
    {
        $timer = $resumeTimer->handle($user);

        return $this->timerResponse($timer);
    }

    /**
     * @throws HttpException<404>
     */
    public function trim(TrimTimerData $data, #[CurrentUser] User $user, TrimTimer $trimTimer): JsonResponse
    {
        $timer = $trimTimer->handle($user, $data);

        return $this->timerResponse($timer);
    }

    /**
     * @throws HttpException<404>
     */
    public function stop(StopTimerData $data, #[CurrentUser] User $user, StopTimer $stopTimer): JsonResponse
    {
        $timeEntry = $stopTimer->handle($user, $data);

        return response()->json(TimeEntryData::from($timeEntry), 201);
    }

    /**
     * @throws HttpException<404>
     */
    public function destroy(#[CurrentUser] User $user, DiscardTimer $discardTimer): Response
    {
        $discardTimer->handle($user);

        return response()->noContent();
    }

    private function timerResponse(RunningTimer $timer, int $status = 200): JsonResponse
    {
        return response()->json(TimerData::from($timer), $status);
    }
}
