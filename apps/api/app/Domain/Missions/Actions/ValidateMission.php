<?php

declare(strict_types=1);

namespace App\Domain\Missions\Actions;

use App\Domain\Clients\Enums\ClientType;
use App\Domain\Clients\Models\Client;
use App\Domain\Missions\Data\CreateMissionData;
use App\Domain\Missions\Data\UpdateMissionData;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Enums\EntryRounding;
use App\Domain\Missions\Models\Mission;
use App\Domain\Shared\Data\MoneyData;
use Illuminate\Validation\ValidationException;

class ValidateMission
{
    /**
     * @param  ?Mission  $mission  The row being updated, so rules that depend on what
     *                             already exists can run. Null when creating.
     */
    public function handle(Client $client, CreateMissionData|UpdateMissionData $data, ?Mission $mission = null): void
    {
        if ($client->type === ClientType::Intermediary && $data->endClientName === null) {
            throw ValidationException::withMessages([
                'endClientName' => __('missions.end_client_required_for_intermediary'),
            ]);
        }

        if ($client->type !== ClientType::Intermediary && $data->endClientName !== null) {
            throw ValidationException::withMessages([
                'endClientName' => __('missions.end_client_only_for_intermediary'),
            ]);
        }

        if ($client->type === ClientType::Internal && $data->rate instanceof MoneyData) {
            throw ValidationException::withMessages([
                'rate' => __('missions.rate_forbidden_for_internal'),
            ]);
        }

        if ($data->billingMode === BillingMode::Fixed && $data->rounding instanceof EntryRounding) {
            throw ValidationException::withMessages([
                'rounding' => __('missions.rounding_forbidden_for_fixed'),
            ]);
        }

        if ($data->craRequired === true && ! $data->billingMode->usesDayFraction()) {
            throw ValidationException::withMessages([
                'craRequired' => __('missions.cra_forbidden_for_hourly'),
            ]);
        }

        if ($mission instanceof Mission && ! $data->billingMode->usesDayFraction() && $mission->cras()->exists()) {
            throw ValidationException::withMessages([
                'billingMode' => __('missions.cannot_leave_daily_billing_with_cras'),
            ]);
        }

        // The billing mode gives duration_minutes and rate_cents their meaning: flipping
        // it would silently reinterpret every entry already tracked (550 €/day becomes
        // 550 €/hour). Once time exists, a new contract is a new mission.
        if ($mission instanceof Mission && $data->billingMode !== $mission->billing_mode && $mission->timeEntries()->exists()) {
            throw ValidationException::withMessages([
                'billingMode' => __('missions.billing_mode_immutable_with_entries'),
            ]);
        }
    }
}
