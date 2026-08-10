<?php

declare(strict_types=1);

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Factories\MissionFactory;
use App\Domain\Missions\Models\Mission;
use App\Domain\Timers\Factories\RunningTimerFactory;
use App\Domain\Timers\Models\RunningTimer;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| The closure you provide to your test functions is always bound to a specific PHPUnit test
| case class. By default, that class is "PHPUnit\Framework\TestCase". Of course, you may
| need to change it using the "pest()" function to bind different classes or traits.
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');

function fromSpa(): TestCase
{
    return test()->withHeader('Referer', 'http://localhost:3000');
}

/**
 * Apply a test's optional factory tweak, or hand the factory back untouched.
 *
 * @template TFactory of Factory
 *
 * @param  TFactory  $factory
 * @param  (callable(TFactory): TFactory)|null  $configure
 * @return TFactory
 */
function configuredFactory(Factory $factory, ?callable $configure): Factory
{
    return $configure === null ? $factory : $configure($factory);
}

/**
 * A mission owned by the given user, through a client of that user.
 *
 * Ownership runs user → client → mission, so arranging one mission means
 * arranging all three. $configure receives the mission factory for states
 * such as hourly() or fixed().
 *
 * @param  (callable(MissionFactory): MissionFactory)|null  $configure
 */
function missionOwnedBy(User $user, ?callable $configure = null): Mission
{
    $factory = Mission::factory()->for(Client::factory()->for($user)->create(), 'client');

    return configuredFactory($factory, $configure)->create(['user_id' => $user->id]);
}

/**
 * The running timer of the given user, on a mission of theirs.
 *
 * Pass $mission when the test asserts against it, and $configure for factory
 * states such as paused().
 *
 * @param  (callable(RunningTimerFactory): RunningTimerFactory)|null  $configure
 */
function runningTimerFor(User $user, ?Mission $mission = null, ?callable $configure = null): RunningTimer
{
    $factory = RunningTimer::factory()->for($mission ?? missionOwnedBy($user), 'mission');

    return configuredFactory($factory, $configure)->create(['user_id' => $user->id]);
}
