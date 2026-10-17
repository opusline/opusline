<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Data\InvoicePaperData;
use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Shared\Pdf\HtmlToPdf;
use App\Domain\Users\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/** A resolved sheet as a PDF: the one template invoices and quotes both print through. */
class RenderPaperPdf
{
    public function __construct(private readonly HtmlToPdf $htmlToPdf) {}

    public function render(InvoicePaperData $paper, DocumentLanguage $language, User $user): string
    {
        return $this->htmlToPdf->render(View::make('invoices.document', [
            'paper' => $paper->toArray(),
            'locale' => $language->locale(),
            'fontPath' => resource_path('fonts'),
            'logoDataUri' => $paper->hasLogo ? $this->logoDataUri($user) : null,
        ])->render());
    }

    /** « Facture-2026-014.pdf »: the number kept to what every file system takes. */
    public static function numberedFileName(string $kind, string $number): string
    {
        return sprintf('%s-%s.pdf', $kind, preg_replace('/[^A-Za-z0-9._-]+/', '-', $number));
    }

    /**
     * The logo is embedded as a data URI: dompdf reads nothing over the
     * network, and the media disk may be object storage.
     */
    private function logoDataUri(User $user): ?string
    {
        $media = $user->getFirstMedia('company_logo');

        if (! $media instanceof Media) {
            return null;
        }

        $disk = Storage::disk($media->disk);
        $path = $media->getPathRelativeToRoot();

        if ($disk->missing($path)) {
            return null;
        }

        return 'data:'.$media->mime_type.';base64,'.base64_encode((string) $disk->get($path));
    }
}
