<?php

declare(strict_types=1);

namespace App\Domain\Shared\Anthropic\Actions;

use Anthropic\Core\Exceptions\APIException;
use Anthropic\Core\Exceptions\AuthenticationException;
use Anthropic\Core\Exceptions\NotFoundException;
use Anthropic\Core\Exceptions\PermissionDeniedException;
use App\Domain\Shared\Anthropic\AnthropicClient;
use App\Domain\Users\Models\User;
use Illuminate\Validation\ValidationException;

/**
 * Stores the account's Anthropic key after asking Anthropic for the model this
 * instance uses: a revoked key or one whose workspace lacks the model fails
 * here, with the fix named, instead of on the first receipt.
 */
class SaveAnthropicApiKey
{
    public function handle(User $user, string $apiKey): void
    {
        $model = AnthropicClient::model();

        try {
            AnthropicClient::forKey($apiKey)->models->retrieve($model);
        } catch (AuthenticationException|PermissionDeniedException) {
            throw ValidationException::withMessages(['apiKey' => __('settings.anthropic_key_rejected')]);
        } catch (NotFoundException) {
            throw ValidationException::withMessages(['apiKey' => __('settings.anthropic_model_unavailable', ['model' => $model])]);
        } catch (APIException $exception) {
            report($exception);
            abort(503, __('settings.anthropic_unreachable'));
        }

        $user->settingsOrFail()->forceFill(['anthropic_api_key' => $apiKey])->save();
    }
}
