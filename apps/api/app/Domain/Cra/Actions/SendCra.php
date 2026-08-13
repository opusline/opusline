<?php

declare(strict_types=1);

namespace App\Domain\Cra\Actions;

use App\Domain\Cra\Data\SendCraData;
use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Cra\Models\Cra;
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
        return $this->lockCra->handle($cra, function (Cra $locked) use ($data): Cra {
            $this->validateCra->handleEdit($locked);

            // RenderCraPdf loads the rest of what the document reads.
            $locked->loadMissing(['days', 'mission']);

            if ($locked->days->isEmpty()) {
                throw ValidationException::withMessages([
                    'days' => __('cra.nothing_to_send'),
                ]);
            }

            $this->storeGeneratedDocument->handle(
                $locked->mission,
                $this->renderCraPdf->handle($locked, $data->applySignature),
                $this->renderCraPdf->fileName($locked),
                DocumentCategory::Cra,
                $locked->documentProperties(),
            );

            $locked->update([
                'status' => CraStatus::Sent,
                'sent_on' => $data->sentOn === null ? CarbonImmutable::today() : CarbonImmutable::parse($data->sentOn),
            ]);

            return $locked;
        });
    }
}
