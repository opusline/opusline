<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Models\Invoice;
use App\Domain\Missions\Actions\ValidateMissionBillingStep;
use App\Domain\Missions\Models\MissionBillingStep;
use Illuminate\Validation\ValidationException;

/**
 * Marks one instalment of a fixed price as billed by this invoice.
 *
 * The invoice remains the only thing that carries money; the step gains a
 * pointer to it and stops asking to be billed. Nothing is summed from steps, so
 * a failure here can never lose or invent revenue — only leave a schedule row
 * still waiting.
 */
class LinkInvoiceBillingStep
{
    public function __construct(private readonly ValidateMissionBillingStep $validate) {}

    public function handle(Invoice $invoice, ?int $billingStepId): void
    {
        if ($billingStepId === null) {
            return;
        }

        $step = MissionBillingStep::query()
            ->where('user_id', $invoice->user_id)
            ->whereKey($billingStepId)
            ->lockForUpdate()
            ->first();

        if (! $step instanceof MissionBillingStep) {
            $this->reject('billing_step_not_on_mission');
        }

        if ($step->mission_id !== $invoice->mission_id) {
            $this->reject('billing_step_not_on_mission');
        }

        $this->validate->assertNotBilled($step);

        $step->update(['invoice_id' => $invoice->id]);
    }

    /**
     * @throws ValidationException
     */
    private function reject(string $key): never
    {
        throw ValidationException::withMessages(['billingStepId' => __('missions.'.$key)]);
    }
}
