<?php

declare(strict_types=1);

namespace App\Domain\Shared\Pdf;

use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\View;
use RuntimeException;

/**
 * Every document the app renders — the CRA, the invoice — goes through one
 * dompdf configuration: local fonts only, no network, metrics cached under
 * storage rather than vendor/.
 */
class HtmlToPdf
{
    public function render(string $html): string
    {
        $options = new Options;
        // The templates load their fonts from disk and their images from data
        // URIs; nothing a document renders should ever reach the network.
        $options->setIsRemoteEnabled(false);
        // dompdf refuses any local file outside its chroot, which defaults to its own
        // package directory: without this the @font-face rules resolve to "none", every
        // src is dropped and the document silently falls back to the built-in Helvetica.
        $options->setChroot([resource_path('fonts')]);
        // And it caches the metrics it extracts from a TTF next to the font itself, which
        // by default means writing into vendor/. Keep that under storage/.
        $options->setFontDir($this->fontCachePath());
        $options->setFontCache($this->fontCachePath());
        $options->setDefaultFont('Geist');

        $dompdf = new Dompdf($options);
        $dompdf->setPaper('A4');
        $dompdf->loadHtml($html);
        $dompdf->render();

        return (string) $dompdf->output();
    }

    /**
     * Renders one line per face the documents use, so dompdf extracts and
     * caches the TTF metrics now. The entrypoint calls this once per boot —
     * metric extraction is what made the first render after a deploy take
     * seconds, inside a request.
     */
    public function warmFontCache(): void
    {
        $fontFaces = View::make('cra.fonts', ['fontPath' => resource_path('fonts')])->render();

        $this->render(<<<HTML
            <html lang="fr"><head><style>{$fontFaces}</style></head><body>
            <span style="font-family: 'Geist'; font-weight: 400;">a</span>
            <span style="font-family: 'Geist'; font-weight: 600;">a</span>
            <span style="font-family: 'Lora'; font-weight: 400;">a</span>
            <span style="font-family: 'Lora'; font-weight: 600;">a</span>
            </body></html>
            HTML);
    }

    private function fontCachePath(): string
    {
        // Under framework/, not app/: storage/app is the user-data volume in
        // production, and font metrics are an artifact of the image's own TTF
        // files — they must version with the container, not outlive it.
        $path = storage_path('framework/cache/dompdf-fonts');

        // Two Octane workers can clear is_dir() at the same time, so the loser's mkdir
        // fails on a directory that now exists. Only that race is silenced; the recheck
        // is what tells it apart from a real failure.
        if (! is_dir($path) && ! @mkdir($path, 0775, true) && ! is_dir($path)) {
            throw new RuntimeException("Could not create the dompdf font cache at [{$path}].");
        }

        return $path;
    }
}
