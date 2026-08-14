<?php

declare(strict_types=1);

namespace App\Domain\Cra\Actions;

use App\Domain\Cra\Data\UploadSignedCraData;
use App\Domain\Cra\Enums\CraStatus;
use App\Domain\Cra\Models\Cra;
use App\Domain\Documents\Actions\UploadDocument;
use App\Domain\Documents\Data\UploadDocumentData;
use App\Domain\Documents\Enums\DocumentCategory;
use Carbon\CarbonImmutable;

/**
 * File the copy the client sent back, next to the original it answers.
 */
class AttachSignedCra
{
    public function __construct(
        private readonly LockCra $lockCra,
        private readonly UploadDocument $uploadDocument,
    ) {}

    public function handle(Cra $cra, UploadSignedCraData $data): Cra
    {
        return $this->lockCra->handle($cra, function (Cra $locked) use ($data): Cra {
            abort_if($locked->status !== CraStatus::Sent, 409, __('cra.only_a_sent_cra_is_returned'));

            $locked->loadMissing('mission');

            $this->uploadDocument->handle(
                $locked->mission,
                new UploadDocumentData(
                    file: $data->file,
                    category: DocumentCategory::SignedCra,
                    fileName: sprintf('CRA-%s-%s-signe', $locked->mission->slug, $locked->month->format('Y-m')),
                ),
                $locked->documentProperties(),
            );

            $locked->update([
                'status' => CraStatus::Signed,
                'signed_on' => $data->signedOn === null
                    ? $locked->user->settingsOrFail()->today()
                    : CarbonImmutable::parse($data->signedOn),
            ]);

            return $locked;
        });
    }
}
