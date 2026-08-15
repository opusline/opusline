<?php

declare(strict_types=1);

namespace App\Providers;

use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Validation\LocalizedValidator;
use App\Domain\Users\Models\User;
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

        Scramble::configure()->withParametersExtractors(
            fn (ParametersExtractors $extractors): ParametersExtractors => $extractors->prepend(SpatieDataParametersExtractor::class),
        );

        FormRequestParametersExtractor::ignoreInstanceOf(Data::class);
    }
}
