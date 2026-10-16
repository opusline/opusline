<?php

declare(strict_types=1);

namespace App\Domain\Invoices\Actions;

use App\Domain\Invoices\Enums\DocumentLanguage;
use App\Domain\Invoices\Models\Invoice;
use App\Domain\Shared\Pdf\HtmlToPdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/** An invoice written in Opusline as a PDF, from the same sheet the screen previews. */
class RenderInvoicePdf
{
    public function __construct(
        private readonly BuildInvoicePaper $buildInvoicePaper,
        private readonly HtmlToPdf $htmlToPdf,
    ) {}

    public function handle(Invoice $invoice, DocumentLanguage $language): string
    {
        $paper = $this->buildInvoicePaper->forInvoice($invoice, $language);

        return $this->htmlToPdf->render(View::make('invoices.document', [
            'paper' => $paper->toArray(),
            'locale' => $language->locale(),
            'fontPath' => resource_path('fonts'),
            'logoDataUri' => $paper->hasLogo ? $this->logoDataUri($invoice) : null,
        ])->render());
    }

    /** « Facture-2026-014.pdf », or « Brouillon-facture.pdf » before it is numbered. */
    public function fileName(Invoice $invoice, DocumentLanguage $language): string
    {
        $english = $language === DocumentLanguage::English;

        return $invoice->number === null
            ? ($english ? 'Draft-invoice.pdf' : 'Brouillon-facture.pdf')
            : sprintf('%s-%s.pdf', $english ? 'Invoice' : 'Facture', preg_replace('/[^A-Za-z0-9._-]+/', '-', $invoice->number));
    }

    /**
     * The logo is embedded as a data URI: dompdf reads nothing over the
     * network, and the media disk may be object storage.
     */
    private function logoDataUri(Invoice $invoice): ?string
    {
        $media = $invoice->user->getFirstMedia('company_logo');

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
