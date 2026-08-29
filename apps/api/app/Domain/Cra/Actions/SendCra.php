<?php

declare(strict_types=1);

namespace App\Domain\Cra\Actions;

use App\Domain\Cra\Data\SendCraData;
use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Cra\Models\Cra;
use App\Domain\Cra\Models\CraDay;
use App\Domain\Documents\Actions\StoreGeneratedDocument;
use App\Domain\Documents\Enums\DocumentCategory;
use Carbon\CarbonImmutable;
use Illuminate\Validation\ValidationException;

/**
 * Hand the CRA to the client: render it, file the PDF among the mission's documents, and
 * freeze the grid.
 *
 * Opusline does not deliver it — the freelance sends the file themselves, exactly as they
 * do with an invoice. What is recorded here is that the month has left the building.
 */
class SendCra
{
    public function __construct(
        private readonly LockCra $lockCra,
        private readonly ValidateCra $validateCra,
        private readonly RenderCraPdf $renderCraPdf,
        private readonly StoreGeneratedDocument $storeGeneratedDocument,
    ) {}

    public function handle(Cra $cra, SendCraData $data): Cra
    {
        // Rendered before the lock: dompdf takes hundreds of milliseconds (and
        // seconds on a cold font cache), and holding the user-row transaction
        // through it would block every other write on the account. The checks
        // here only spare a pointless render — the locked re-checks below are
        // the authoritative ones.
        $this->validateCra->handleEdit($cra);

        // RenderCraPdf loads the rest of what the document reads.
        $cra->loadMissing(['days', 'mission']);

        if ($cra->days->isEmpty()) {
            throw ValidationException::withMessages([
                'days' => __('cra.nothing_to_send'),
            ]);
        }

        $renderedGrid = $this->gridFingerprint($cra);
        $pdf = $this->renderCraPdf->handle($cra, $data->applySignature);

        return $this->lockCra->handle($cra, function (Cra $locked) use ($data, $pdf, $renderedGrid): Cra {
            $this->validateCra->handleEdit($locked);

            // The archived document must show the days that get frozen. A grid
            // edit that committed while dompdf was rendering would otherwise be
            // sent under a PDF of the old days — refuse and let the user press
            // Envoyer again.
            abort_if($this->gridFingerprint($locked) !== $renderedGrid, 409, __('cra.changed_while_sending'));

            $this->storeGeneratedDocument->handle(
                $locked->mission,
                $pdf,
                $this->renderCraPdf->fileName($locked),
                DocumentCategory::Cra,
                $locked->documentProperties(),
            );

            $locked->update([
                'status' => CraStatus::Sent,
                'sent_on' => $data->sentOn === null
                    ? $locked->user->settingsOrFail()->today()
                    : CarbonImmutable::parse($data->sentOn),
            ]);

            return $locked;
        });
    }

    /**
     * The grid as one comparable value. LockCra's refresh() reloads the days
     * relation, so the locked read is what the transaction will freeze.
     */
    private function gridFingerprint(Cra $cra): string
    {
        return $cra->days
            ->map(static fn (CraDay $day): string => $day->date->toDateString().':'.$day->day_fraction_bp)
            ->sort()
            ->implode('|');
    }
}
