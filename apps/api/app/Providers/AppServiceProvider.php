<?php

declare(strict_types=1);

namespace App\Providers;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Validation\LocalizedValidator;
use App\Domain\Users\Models\User;
use App\Http\Users\Support\PendingLogin;
use App\OpenApi\SpatieDataParametersExtractor;
use Carbon\CarbonImmutable;
use Dedoc\Scramble\Configuration\ParametersExtractors;
use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\OperationExtensions\ParameterExtractor\FormRequestParametersExtractor;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Contracts\Translation\Translator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;
use Spatie\LaravelData\Data;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    #[\Override]
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Date::use(CarbonImmutable::class);

        Model::shouldBeStrict(! $this->app->isProduction());

        Relation::enforceMorphMap([
            'client' => Client::class,
            'mission' => Mission::class,
            'user' => User::class,
        ]);

        DB::prohibitDestructiveCommands($this->app->isProduction());

        Validator::resolver(fn (Translator $translator, array $data, array $rules, array $messages, array $attributes): LocalizedValidator => new LocalizedValidator($translator, $data, $rules, $messages, $attributes));

        $caller = static function (Request $request): string {
            $identifier = $request->user()?->getAuthIdentifier();

            if (is_int($identifier) || is_string($identifier)) {
                return (string) $identifier;
            }

            return $request->ip() ?? 'unknown';
        };

        RateLimiter::for('api', fn (Request $request): Limit => Limit::perMinute(120)->by($caller($request)));
        RateLimiter::for('uploads', fn (Request $request): Limit => Limit::perMinute(20)->by($caller($request)));
        // Both take a password or a six-digit code from a logged-in caller:
        // six tries a minute keeps guessing hopeless without hurting a typo.
        RateLimiter::for('confirm-password', fn (Request $request): Limit => Limit::perMinute(6)->by('confirm:'.$caller($request)));
        RateLimiter::for('two-factor-setup', fn (Request $request): Limit => Limit::perMinute(6)->by('2fa-setup:'.$caller($request)));

        // The challenge answers for a guest who has proven the password: keyed
        // on the pending account so one attacker cannot spend another
        // account's tries, with an IP ceiling for callers with no pending login.
        RateLimiter::for('two-factor-challenge', function (Request $request): array {
            $pendingUserId = $request->hasSession() ? $request->session()->get(PendingLogin::KEY_USER_ID) : null;
            $ip = $request->ip() ?? 'unknown';

            return [
                Limit::perMinute(10)->by('2fa:'.(is_int($pendingUserId) ? $pendingUserId : 'none').':'.$ip),
                Limit::perMinute(20)->by('2fa-ip:'.$ip),
            ];
        });

        // Login is limited per email as well as per IP, so an attacker
        // rotating IPs still hits a per-account wall.
        RateLimiter::for('login', function (Request $request): array {
            $email = $request->input('email');

            return [
                Limit::perMinute(6)->by('ip:'.($request->ip() ?? 'unknown')),
                Limit::perMinute(6)->by('email:'.(is_string($email) ? mb_strtolower($email) : 'invalid')),
            ];
        });

        Scramble::configure()->withParametersExtractors(
            fn (ParametersExtractors $extractors): ParametersExtractors => $extractors->prepend(SpatieDataParametersExtractor::class),
        );

        FormRequestParametersExtractor::ignoreInstanceOf(Data::class);
    }
}
