<?php

declare(strict_types=1);

namespace App\Domain\Cra\Actions;

use App\Domain\Cra\Data\CraDayData;
use App\Domain\Cra\Models\Cra;
use App\Domain\Cra\Models\CraDay;
use App\Domain\Missions\Enums\BillingMode;
use App\Domain\Missions\Models\Mission;
use App\Domain\Settings\Models\UserSettings;
use App\Domain\Shared\Enums\Currency;
use Carbon\CarbonImmutable;
use Cknow\Money\Money;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;
use RuntimeException;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * The CRA as a PDF, rendered from the same figures the screen shows.
 */
class RenderCraPdf
{
    /**
     * Spelled out rather than taken from Carbon's locale: this document is French whatever
     * APP_LOCALE says, and Carbon's locale() is a getter/setter whose union return type
     * only muddies the call sites.
     *
     * @var array<int, string>
     */
    private const array MONTHS = [
        1 => 'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
    ];

    /** @var array<int, string> */
    private const array MONTHS_SHORT = [
        1 => 'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
        'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
    ];

    public function __construct(private readonly DescribeCra $describeCra) {}

    public function handle(Cra $cra, bool $applySignature = false): string
    {
        $cra->loadMissing(['days', 'mission.client', 'user.settings']);

        $options = new Options;
        // The template loads its fonts and the signature from disk and from data URIs;
        // nothing it renders should ever reach the network.
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
        $dompdf->loadHtml(View::make('cra.document', $this->viewData($cra, $applySignature))->render());
        $dompdf->render();

        return (string) $dompdf->output();
    }

    private function fontCachePath(): string
    {
        $path = storage_path('app/dompdf-fonts');

        // Two Octane workers can clear is_dir() at the same time, so the loser's mkdir
        // fails on a directory that now exists. Only that race is silenced; the recheck
        // is what tells it apart from a real failure.
        if (! is_dir($path) && ! @mkdir($path, 0775, true) && ! is_dir($path)) {
            throw new RuntimeException("Could not create the dompdf font cache at [{$path}].");
        }

        return $path;
    }

    /** The file name the client sees: "CRA-callisto-front-2026-07.pdf". */
    public function fileName(Cra $cra): string
    {
        return sprintf('CRA-%s-%s.pdf', $cra->mission->slug, $cra->month->format('Y-m'));
    }

    /**
     * Everything the template prints, resolved.
     *
     * Public because it is the only seam a test can read: dompdf Flate-compresses the
     * text stream, so asserting on the PDF bytes proves nothing about the wording.
     *
     * @return array<string, mixed>
     */
    public function viewData(Cra $cra, bool $applySignature = false): array
    {
        $data = $this->describeCra->handle($cra);
        // RegisterUser gives every account its settings row; without one there is no
        // issuer to put on the document, so say that rather than render a blank header.
        $settings = $cra->user->settings ?? throw new RuntimeException(
            "User {$cra->user_id} has no settings row.",
        );
        $mission = $cra->mission;

        return [
            'fontPath' => resource_path('fonts'),
            'monthLabel' => $this->capitalized(self::MONTHS[$cra->month->month].' '.$cra->month->year),
            'issuer' => $this->issuer($settings, $cra),
            // Both parties, because on an ESN mission they differ: the invoice goes to the
            // client, and the CRA is validated by whoever the work was actually done for.
            'clientName' => $mission->client->name,
            'recipientName' => $mission->recipientName(),
            'missionName' => $mission->name,
            'rateLabel' => $this->rateLabel($mission),
            'weekdayLabels' => ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            'weeks' => $this->weeks($data->days),
            'totalLabel' => $this->days($data->totalDays),
            'placeAndDate' => $this->placeAndDate($settings),
            'signatureDataUri' => $applySignature ? $this->signatureDataUri($cra) : null,
        ];
    }

    /**
     * Every user has a settings row — RegisterUser creates one — so a missing one is a
     * broken account, not a case to paper over with blanks.
     *
     * @return array<string, ?string>
     */
    private function issuer(UserSettings $settings, Cra $cra): array
    {
        $address = array_filter([
            $settings->company_address_line1,
            $settings->company_address_line2,
            trim(($settings->company_postal_code ?? '').' '.($settings->company_city ?? '')),
        ], fn (?string $line): bool => $line !== null && $line !== '');

        $contact = array_filter([$settings->contact_email, $settings->phone]);

        return [
            'name' => $settings->trade_name ?? $cra->user->name,
            'siret' => $settings->siret,
            'vatNumber' => $settings->vat_number,
            'address' => $address === [] ? null : implode(' · ', $address),
            'contact' => $contact === [] ? null : implode(' · ', $contact),
        ];
    }

    private function placeAndDate(UserSettings $settings): string
    {
        $now = $settings->today();
        $today = sprintf('%d %s %d', $now->day, self::MONTHS[$now->month], $now->year);
        $city = $settings->signature_city;

        return $city === null
            ? sprintf(' · le %s', $today)
            : sprintf(' · fait à %s, le %s', $city, $today);
    }

    /**
     * The month as calendar weeks, Monday first, each carrying its own total so the recap
     * table and the grid cannot disagree.
     *
     * @param  list<CraDayData>  $days
     * @return list<array<string, mixed>>
     */
    private function weeks(array $days): array
    {
        $byDate = [];

        foreach ($days as $day) {
            $byDate[$day->date->toDateString()] = $day;
        }

        $first = $days[0]->date;
        $last = $days[count($days) - 1]->date;
        $cursor = $first->startOfWeek(CarbonImmutable::MONDAY);
        $weeks = [];

        while ($cursor->lessThanOrEqualTo($last)) {
            $cells = [];
            $totalBp = 0;

            for ($offset = 0; $offset < 7; $offset++) {
                $date = $cursor->addDays($offset);
                $day = $byDate[$date->toDateString()] ?? null;

                if ($day === null) {
                    $cells[] = ['className' => 'outside', 'dayOfMonth' => null, 'value' => ''];

                    continue;
                }

                $totalBp += $day->dayFractionBp;
                $isClosed = $day->isWeekend || $day->isHoliday;
                $isWorked = $day->dayFractionBp > 0;

                $cells[] = [
                    'className' => match (true) {
                        $isWorked && $isClosed => 'worked-off',
                        $isWorked => 'worked',
                        $isClosed => 'closed',
                        default => 'idle',
                    },
                    'dayOfMonth' => $day->date->day,
                    'value' => $isWorked ? $this->days(CraDay::daysFromBasisPoints($day->dayFractionBp)) : '',
                ];
            }

            $weeks[] = [
                'days' => $cells,
                'label' => $this->weekLabel($cursor, $first, $last),
                'total' => $totalBp === 0 ? null : $this->days(CraDay::daysFromBasisPoints($totalBp)),
            ];

            $cursor = $cursor->addWeek();
        }

        return $weeks;
    }

    private function weekLabel(CarbonImmutable $weekStart, CarbonImmutable $first, CarbonImmutable $last): string
    {
        $from = $weekStart->lessThan($first) ? $first : $weekStart;
        $to = $weekStart->addDays(6)->greaterThan($last) ? $last : $weekStart->addDays(6);

        return sprintf('%d – %d %s', $from->day, $to->day, self::MONTHS_SHORT[$to->month]);
    }

    /** French decimals: a day and a half reads "1,5", never "1.5". */
    private function days(float $days): string
    {
        return rtrim(rtrim(number_format($days, 2, ',', ' '), '0'), ',');
    }

    /**
     * A Fixed mission can require a CRA, and dailyRate() is null for one, so reading the
     * rate off that alone printed "—" on paper while the screen showed the real figure.
     * The layout stays French whatever the account locale — this document is a French
     * artifact — while formatMissionRate() on screen follows the user's own format.
     */
    private function rateLabel(Mission $mission): string
    {
        $rate = $mission->rate_cents;

        if (! $rate instanceof Money) {
            return 'non facturable';
        }

        // Cents kept, trailing zeros dropped — the same shape as the screen's
        // Intl maximumFractionDigits: 2, so a 550,50 €/j mission does not print 551.
        // Built from integers: money never passes through a float, even for display.
        $cents = (int) $rate->getAmount();
        $amount = number_format(intdiv($cents, 100), 0, ',', ' ');

        if ($cents % 100 !== 0) {
            $amount .= ','.rtrim(sprintf('%02d', $cents % 100), '0');
        }
        $symbol = Currency::from($rate->getCurrency()->getCode())->symbol();

        return $mission->billing_mode === BillingMode::Fixed
            ? $amount.' '.$symbol.' forfait'
            : $amount.' '.$symbol.' / jour';
    }

    private function signatureDataUri(Cra $cra): ?string
    {
        $media = $cra->user->getMedia('signature')->first();

        if (! $media instanceof Media) {
            return null;
        }

        $contents = Storage::disk($media->disk)->get($media->getPathRelativeToRoot());

        if ($contents === null) {
            return null;
        }

        return 'data:'.$media->mime_type.';base64,'.base64_encode($contents);
    }

    /** Not mb_ucfirst(): that is PHP 8.4, and composer.json still allows 8.3. */
    private function capitalized(string $label): string
    {
        return mb_strtoupper(mb_substr($label, 0, 1)).mb_substr($label, 1);
    }
}
