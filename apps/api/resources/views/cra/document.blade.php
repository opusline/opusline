{{--
    The CRA as the client receives it.

    dompdf has no flex and no grid, so every row that the design lays out side by side is a
    table here: the header, the client/mission/TJM line, the month calendar and the two
    signature blocks. Colours are solid hex rather than rgba — dompdf's alpha compositing is
    unreliable, and these are the flattened equivalents of the canvas' washes on white.

    Its React twin is apps/web/src/features/cra/components/cra-document.tsx. Both are fed by
    DescribeCra, so the figures cannot drift; only the styling lives in two places.
--}}
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <style>
        @font-face {
            font-family: 'Geist';
            font-weight: 400;
            src: url("{{ $fontPath }}/Geist-Regular.ttf") format('truetype');
        }
        @font-face {
            font-family: 'Geist';
            font-weight: 600;
            src: url("{{ $fontPath }}/Geist-Medium.ttf") format('truetype');
        }
        @font-face {
            font-family: 'Lora';
            font-weight: 400;
            src: url("{{ $fontPath }}/Lora-Regular.ttf") format('truetype');
        }
        @font-face {
            font-family: 'Lora';
            font-weight: 600;
            src: url("{{ $fontPath }}/Lora-SemiBold.ttf") format('truetype');
        }

        @page { margin: 28px 26px; }

        body { font-family: 'Geist', sans-serif; font-size: 12px; color: #111; margin: 0; }
        table { width: 100%; border-collapse: collapse; }

        /* On the cells, not the table: dompdf draws a table's own border faintly. */
        .head td { border-bottom: 2px solid #111; padding-bottom: 14px; vertical-align: top; }
        .head-title { font-family: 'Lora', serif; font-size: 20px; font-weight: 600; }
        .head-month { font-size: 12px; color: #444; padding-top: 3px; }
        .issuer { text-align: right; font-size: 12px; line-height: 1.6; color: #333; }
        .issuer-name { font-weight: 600; color: #111; }
        .issuer-quiet { color: #555; }

        .facts { font-size: 12px; color: #333; padding: 16px 0; }
        .facts-label { color: #666; }

        .dow { text-align: center; font-size: 9px; letter-spacing: 0.06em; text-transform: uppercase; color: #666; padding-bottom: 3px; }

        .cal { border-collapse: separate; border-spacing: 2px; }
        .cal td { width: 14.2%; height: 34px; vertical-align: top; padding: 3px 4px; }
        .day-num { font-size: 8px; color: #999; }
        .day-val { font-size: 11px; font-weight: 600; text-align: center; padding-top: 4px; }
        /* Worked: the brand wash flattened onto white. */
        .worked { background-color: #FBF2E4; border: 1px solid #E4CDA6; }
        /* Worked on a day nobody was expected to: same wash, stated louder. */
        .worked-off { background-color: #F6E4C6; border: 1px solid #D4AE72; }
        .idle { border: 1px dashed #DDD; }
        .closed { background-color: #F2F2F2; }
        .outside { border: none; }

        .legend { font-size: 10px; color: #666; padding-bottom: 18px; }
        .legend span { padding-right: 14px; }

        .recap th { text-align: left; border-bottom: 1px solid #111; padding: 6px 4px; font-weight: 600; }
        .recap th.num, .recap td.num { text-align: right; }
        .recap td { padding: 6px 4px; border-bottom: 1px solid #E4E4E4; }
        .recap tfoot td { padding: 10px 4px; font-weight: 600; border-top: 2px solid #111; border-bottom: none; }

        .signatures { padding-top: 32px; font-size: 11px; color: #333; }
        .signatures td { width: 50%; vertical-align: top; }
        .sig-title { font-weight: 600; color: #111; }
        .sig-sub { padding-top: 2px; color: #666; }
        .sig-line { height: 52px; border-bottom: 1px solid #BBB; margin-top: 6px; }
        .sig-image { max-height: 46px; }
    </style>
</head>
<body>
<table class="head">
    <tr>
        <td>
            <div class="head-title">Compte rendu d'activité</div>
            <div class="head-month">{{ $monthLabel }}</div>
        </td>
        <td class="issuer">
            <div class="issuer-name">{{ $issuer['name'] }}</div>
            @if ($issuer['siret'] !== null)
                <div>SIRET {{ $issuer['siret'] }}</div>
            @endif
            @if ($issuer['vatNumber'] !== null)
                <div>TVA {{ $issuer['vatNumber'] }}</div>
            @endif
            @if ($issuer['address'] !== null)
                <div class="issuer-quiet">{{ $issuer['address'] }}</div>
            @endif
            @if ($issuer['contact'] !== null)
                <div class="issuer-quiet">{{ $issuer['contact'] }}</div>
            @endif
        </td>
    </tr>
</table>

<table class="facts">
    <tr>
        <td><span class="facts-label">Client :</span> {{ $clientName }}</td>
        <td style="text-align: center;"><span class="facts-label">Mission :</span> {{ $missionName }}</td>
        <td style="text-align: right;"><span class="facts-label">TJM :</span> {{ $rateLabel }}</td>
    </tr>
</table>

<table class="cal">
    <tr>
        @foreach ($weekdayLabels as $weekdayLabel)
            <td class="dow">{{ $weekdayLabel }}</td>
        @endforeach
    </tr>
    @foreach ($weeks as $week)
        <tr>
            @foreach ($week['days'] as $day)
                <td class="{{ $day['className'] }}">
                    @if ($day['dayOfMonth'] !== null)
                        <div class="day-num">{{ $day['dayOfMonth'] }}</div>
                        <div class="day-val">{{ $day['value'] }}</div>
                    @endif
                </td>
            @endforeach
        </tr>
    @endforeach
</table>

<div class="legend">
    <span>1 = journée</span><span>0,5 = demi-journée</span><span>Grisé = week-end ou férié</span><span>Ambré = jour non ouvré travaillé</span>
</div>

<table class="recap">
    <thead>
        <tr>
            <th>Semaine</th>
            <th class="num">Jours</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($weeks as $week)
            @if ($week['total'] !== null)
                <tr>
                    <td>{{ $week['label'] }}</td>
                    <td class="num">{{ $week['total'] }}</td>
                </tr>
            @endif
        @endforeach
    </tbody>
    <tfoot>
        <tr>
            <td>Total à facturer</td>
            <td class="num">{{ $totalLabel }}</td>
        </tr>
    </tfoot>
</table>

<table class="signatures">
    <tr>
        <td>
            <div class="sig-title">Le prestataire</div>
            <div class="sig-sub">{{ $issuer['name'] }}{{ $placeAndDate }}</div>
            <div class="sig-line">
                @if ($signatureDataUri !== null)
                    <img alt="Signature" class="sig-image" src="{{ $signatureDataUri }}">
                @endif
            </div>
        </td>
        <td style="padding-left: 28px;">
            <div class="sig-title">Le client — bon pour accord</div>
            <div class="sig-sub">{{ $recipientName }} · date et signature</div>
            <div class="sig-line"></div>
        </td>
    </tr>
</table>
</body>
</html>
