<?php

declare(strict_types=1);

namespace App\Http\Expenses\Controllers;

use App\Domain\Expenses\Actions\CancelSubscription;
use App\Domain\Expenses\Actions\ChangeSubscriptionAmount;
use App\Domain\Expenses\Actions\CreateSubscription;
use App\Domain\Expenses\Actions\DeleteSubscription;
use App\Domain\Expenses\Actions\ListSubscriptions;
use App\Domain\Expenses\Actions\PauseSubscription;
use App\Domain\Expenses\Actions\ReactivateSubscription;
use App\Domain\Expenses\Actions\UpdateSubscription;
use App\Domain\Expenses\Data\CancelSubscriptionData;
use App\Domain\Expenses\Data\ChangeSubscriptionAmountData;
use App\Domain\Expenses\Data\SubscriptionInputData;
use App\Domain\Expenses\Models\Subscription;
use App\Domain\Users\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\CurrentUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/** Every write answers with the recomputed tab, as the journal does. */
class SubscriptionController extends Controller
{
    public function __construct(private readonly ListSubscriptions $listSubscriptions) {}

    public function index(#[CurrentUser] User $user): JsonResponse
    {
        return $this->tab($user);
    }

    public function store(SubscriptionInputData $data, #[CurrentUser] User $user, CreateSubscription $createSubscription): JsonResponse
    {
        $createSubscription->handle($user, $data);

        return $this->tab($user, 201);
    }

    public function update(SubscriptionInputData $data, #[CurrentUser] User $user, Subscription $subscription, UpdateSubscription $updateSubscription): JsonResponse
    {
        $updateSubscription->handle($subscription, $data);

        return $this->tab($user);
    }

    public function destroy(Subscription $subscription, DeleteSubscription $deleteSubscription): Response
    {
        $deleteSubscription->handle($subscription);

        return response()->noContent();
    }

    public function storeAmount(
        ChangeSubscriptionAmountData $data,
        #[CurrentUser] User $user,
        Subscription $subscription,
        ChangeSubscriptionAmount $changeSubscriptionAmount,
    ): JsonResponse {
        $changeSubscriptionAmount->handle($subscription, $data);

        return $this->tab($user, 201);
    }

    public function storePause(#[CurrentUser] User $user, Subscription $subscription, PauseSubscription $pauseSubscription): JsonResponse
    {
        $pauseSubscription->handle($subscription, paused: true);

        return $this->tab($user, 201);
    }

    public function destroyPause(#[CurrentUser] User $user, Subscription $subscription, PauseSubscription $pauseSubscription): JsonResponse
    {
        $pauseSubscription->handle($subscription, paused: false);

        return $this->tab($user);
    }

    public function storeCancellation(
        CancelSubscriptionData $data,
        #[CurrentUser] User $user,
        Subscription $subscription,
        CancelSubscription $cancelSubscription,
    ): JsonResponse {
        $cancelSubscription->handle($subscription, $data);

        return $this->tab($user, 201);
    }

    public function destroyCancellation(#[CurrentUser] User $user, Subscription $subscription, ReactivateSubscription $reactivateSubscription): JsonResponse
    {
        $reactivateSubscription->handle($subscription);

        return $this->tab($user);
    }

    private function tab(User $user, int $status = 200): JsonResponse
    {
        return response()->json($this->listSubscriptions->handle($user), $status);
    }
}
