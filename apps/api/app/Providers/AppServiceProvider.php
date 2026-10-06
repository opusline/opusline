<?php

declare(strict_types=1);

namespace App\Providers;

use App\Domain\Clients\Models\Client;
use App\Domain\Expenses\Models\Expense;
use App\Domain\Missions\Models\Mission;
use App\Domain\Passkeys\Webauthn\PasskeyCeremony;
use App\Domain\Passkeys\Webauthn\RelyingParty;
use App\Domain\Passkeys\Webauthn\WebauthnLibCeremony;
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
use Illuminate\Database\LazyLoadingViolationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;
use Laravel\Telescope\TelescopeServiceProvider;
use Sentry\Laravel\Integration;
use Sentry\Laravel\Integration\ModelViolations\LazyLoadingModelViolationReporter;
use Spatie\LaravelData\Data;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    #[\Override]
    public function register(): void
    {
        $this->app->singleton(RelyingParty::class, fn (): RelyingParty => RelyingParty::fromConfig());
        $this->app->bind(PasskeyCeremony::class, WebauthnLibCeremony::class);

        // Scoped, so the reporter's "already reported" memory is per request
        // under Octane rather than per worker. Sent at once rather than after
        // the response: a queue job has no response to wait for.
        $this->app->scoped(
            LazyLoadingModelViolationReporter::class,
            fn (): callable => Integration::lazyLoadingViolationReporter(reportAfterResponse: false),
        );

        // A dev dependency the production image is built without: registered
        // by hand instead of discovered, and its tables are only ever created
        // on a development database.
        if ($this->app->environment('local')) {
            $this->app->register(TelescopeServiceProvider::class);
            $this->loadMigrationsFrom(base_path('vendor/laravel/telescope/database/migrations'));
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Date::use(CarbonImmutable::class);

        Model::shouldBeStrict(! $this->app->isProduction());

        // A lazy load is an N+1 in the making: outside production it throws,
        // in production Sentry's reporter takes it and the relation still
        // loads. Laravel skips its own "new or unsaved model" guard once a
        // handler is registered, hence the copy.
        Model::preventLazyLoading();
        Model::handleLazyLoadingViolationUsing(function (Model $model, string $relation): void {
            if (! $model->exists || $model->wasRecentlyCreated) {
                return;
            }

            if ($this->app->isProduction()) {
                $this->app->make(LazyLoadingModelViolationReporter::class)($model, $relation);

                return;
            }

            throw new LazyLoadingViolationException($model, $relation);
        });

        Relation::enforceMorphMap([
            'client' => Client::class,
            'expense' => Expense::class,
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
        // Each test costs the relay two emails. Named, because an anonymous
        // `throttle:3,1` counts on the account alone and would share its
        // allowance with every other route limited that way.
        RateLimiter::for('mail-test', fn (Request $request): Limit => Limit::perMinute(3)->by('mail-test:'.$caller($request)));
        RateLimiter::for('two-factor-setup', fn (Request $request): Limit => Limit::perMinute(6)->by('2fa-setup:'.$caller($request)));

        RateLimiter::for('passkey-login', fn (Request $request): Limit => Limit::perMinute(10)->by('passkey:'.($request->ip() ?? 'unknown')));

        // The challenge answers for a guest who has proven the password: keyed
        // on the pending account alone, so an attacker rotating addresses
        // still shares one allowance, with an IP ceiling for callers with no
        // pending login.
        RateLimiter::for('two-factor-challenge', function (Request $request): array {
            $pendingUserId = $request->hasSession() ? $request->session()->get(PendingLogin::KEY_USER_ID) : null;
            $ip = $request->ip() ?? 'unknown';

            return [
                Limit::perMinute(10)->by('2fa:'.(is_int($pendingUserId) ? 'user:'.$pendingUserId : 'none:'.$ip)),
                Limit::perMinute(20)->by('2fa-ip:'.$ip),
            ];
        });

        // Login is limited per account as well as per IP, so an attacker
        // rotating IPs still hits a per-account wall. The account is the one
        // the database resolves: a case-insensitive MySQL collation also
        // equates accented spellings of an address, and each spelling must
        // not buy a fresh allowance.
        RateLimiter::for('login', function (Request $request): array {
            $email = $request->input('email');
            $accountId = is_string($email) ? User::query()->where('email', $email)->value('id') : null;

            return [
                Limit::perMinute(6)->by('ip:'.($request->ip() ?? 'unknown')),
                Limit::perMinute(6)->by(match (true) {
                    is_int($accountId) => 'account:'.$accountId,
                    is_string($email) => 'email:'.mb_strtolower($email),
                    default => 'email:invalid',
                }),
            ];
        });

        // Asking for a reset link is rationed per caller, and per address by
        // the hour: the broker already refuses a second link within a minute,
        // which alone would still let a stranger mail someone 1,440 times a day.
        RateLimiter::for('password-reset-request', function (Request $request): array {
            $email = $request->input('email');

            return [
                Limit::perMinute(6)->by('password-reset-request-ip:'.($request->ip() ?? 'unknown')),
                Limit::perHour(6)->by('password-reset-request-email:'.(is_string($email) ? mb_strtolower($email) : 'invalid')),
            ];
        });

        // Spending a link is rationed per caller only. Keyed on the address,
        // anyone who knows it could use up the allowance and keep its owner
        // from ever submitting the link they were sent.
        RateLimiter::for('password-reset', fn (Request $request): Limit => Limit::perMinute(6)->by('password-reset-ip:'.($request->ip() ?? 'unknown')));

        Scramble::configure()->withParametersExtractors(
            fn (ParametersExtractors $extractors): ParametersExtractors => $extractors->prepend(SpatieDataParametersExtractor::class),
        );

        FormRequestParametersExtractor::ignoreInstanceOf(Data::class);
    }
}
