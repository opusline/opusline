<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Domain\Shared\Pdf\HtmlToPdf;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Description('Extract and cache the dompdf font metrics so no request pays the first PDF render')]
#[Signature('cra:warm-pdf-fonts')]
class WarmCraPdfFonts extends Command
{
    public function handle(HtmlToPdf $htmlToPdf): int
    {
        $htmlToPdf->warmFontCache();

        $this->components->info('dompdf font cache warmed.');

        return self::SUCCESS;
    }
}
