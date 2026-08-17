<?php

declare(strict_types=1);

namespace App\Domain\Settings\Actions;

use App\Domain\Settings\Data\RecordDeclarationData;
use App\Domain\Settings\Models\FiscalDeclaration;
use App\Domain\Users\Models\User;
use Carbon\CarbonImmutable;

class RecordDeclaration
{
    public function handle(User $user, RecordDeclarationData $data): FiscalDeclaration
    {
        $filedOn = $data->filedOn === null
            ? $user->settingsOrFail()->today()
            : CarbonImmutable::parse($data->filedOn);

        // Filing the same period twice corrects the record rather than
        // duplicating it — the table's unique index says so too.
        return $user->fiscalDeclarations()->updateOrCreate(
            ['kind' => $data->kind, 'period' => $data->period],
            [
                'filed_on' => $filedOn,
                'currency' => $data->declaredAmount?->currency->value
                    ?? $user->settingsOrFail()->currency->value,
                'declared_amount_cents' => $data->declaredAmount?->toMoney(),
            ],
        );
    }
}
