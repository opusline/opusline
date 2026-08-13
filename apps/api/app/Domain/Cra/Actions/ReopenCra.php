<?php

declare(strict_types=1);

namespace App\Domain\Cra\Actions;

use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Cra\Models\Cra;
use App\Domain\Documents\Enums\DocumentCategory;

/**
 * Put a sent CRA back into draft, for the case every freelance knows: it went out with a
 * day missing.
 *
 * Refused once the client has returned it signed — at that point the document is theirs as
 * much as yours, and correcting it means producing a new one.
 */
class ReopenCra
{
    public function __construct(private readonly LockCra $lockCra) {}

    public function handle(Cra $cra): Cra
    {
        return $this->lockCra->handle($cra, function (Cra $locked): Cra {
            abort_if($locked->status !== CraStatus::Sent, 409, __('cra.only_a_sent_cra_reopens'));
            abort_if($locked->documents(DocumentCategory::SignedCra)->exists(), 409, __('cra.signed_return_filed'));

            $locked->update(['status' => CraStatus::Draft, 'sent_on' => null]);

            return $locked;
        });
    }
}
