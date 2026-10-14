{{--
    An invoice as the client receives it, rendered from InvoicePaperData — the
    same shape the web preview (apps/web/src/features/invoices/components/invoice-paper.tsx)
    renders, so the wording lives in one place, BuildInvoicePaper.

    dompdf has no flex and no grid, so every side-by-side block of the design
    (canvas InvoicePaper) is a table here. Colours are solid hex: dompdf's
    alpha compositing is unreliable.
--}}
<!DOCTYPE html>
<html lang="{{ $locale }}">
<head>
    <meta charset="utf-8">
    <style>
        @include('cra.fonts')

        @page { margin: 0 0 40px 0; }

        body { font-family: 'Geist', sans-serif; font-size: 11px; line-height: 1.5; color: #1D1A17; margin: 0; }
        table { width: 100%; border-collapse: collapse; }
        td, th { vertical-align: top; }

        .bar { height: 3px; background: #BA7517; }
        .sheet { padding: 34px 34px 0; }

        .logo { max-width: 160px; max-height: 56px; margin-bottom: 14px; }
        .title { font-size: 17px; font-weight: 600; color: #141210; }
        .meta { margin-top: 8px; }
        .meta-key { font-weight: 600; }
        .stamp { text-align: right; }
        .stamp span { display: inline-block; padding: 3px 9px; border: 1px solid #D8D1C7; border-radius: 3px; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: #7A716A; }

        .rule { height: 1px; background: #E6E1D9; margin: 18px 0; }

        .party-name { font-weight: 600; color: #141210; }
        .buyer { text-align: right; }

        .doc-title { font-size: 14px; font-weight: 600; color: #141210; margin: 24px 0 4px; }
        .doc-description { color: #574F47; margin-bottom: 6px; white-space: pre-wrap; }

        .lines { margin-top: 10px; }
        .lines th { background: #F1EDE6; font-size: 10px; font-weight: 600; color: #332E29; padding: 7px 8px; text-align: left; }
        .lines td { padding: 8px 8px; border-bottom: 1px solid #EFEBE5; }
        .num { text-align: right; white-space: nowrap; }
        .line-label { font-weight: 600; color: #141210; }
        .line-detail { color: #6A615A; white-space: pre-wrap; margin-top: 2px; }
        .empty { color: #7C736B; }

        .summary { margin-top: 16px; }
        .vat-table { width: auto; border: 1px solid #E6E1D9; font-size: 10px; }
        .vat-table th { background: #F1EDE6; font-weight: 600; padding: 5px 8px; text-align: left; }
        .vat-table td { padding: 5px 8px; }
        .totals-table { width: 230px; border: 1px solid #E6E1D9; margin-left: auto; }
        .totals-table td { padding: 6px 10px; border-bottom: 1px solid #EFEBE5; }
        .totals-table .emphasis td { font-weight: 600; background: #F4F1EB; color: #141210; border-bottom: 0; }

        .payment { margin-top: 24px; border: 1px solid #E6E1D9; }
        .payment-title { background: #F1EDE6; font-weight: 600; font-size: 10px; padding: 6px 10px; }
        .payment-rows { padding: 8px 10px; }

        .legal { margin-top: 22px; font-size: 10px; line-height: 1.55; color: #6A615A; }

        .footer { position: fixed; bottom: -26px; left: 34px; right: 34px; border-top: 1px solid #EFEBE5; padding-top: 6px; text-align: right; font-size: 9px; color: #7C736B; }
        .footer .page:after { content: counter(page); }
    </style>
</head>
<body>
    <div class="bar"></div>
    <div class="footer">{{ $paper['footer'] }} · <span class="page"></span></div>

    <div class="sheet">
        <table>
            <tr>
                <td>
                    @if ($logoDataUri)
                        <img class="logo" src="{{ $logoDataUri }}" alt="">
                    @endif
                    <div class="title">{{ $paper['title'] }}</div>
                    <div class="meta">
                        @foreach ($paper['meta'] as $row)
                            <div><span class="meta-key">{{ $row['label'] }}{{ $paper['labelSeparator'] }}</span> {{ $row['value'] }}</div>
                        @endforeach
                    </div>
                </td>
                @if ($paper['stamp'])
                    <td class="stamp"><span>{{ $paper['stamp'] }}</span></td>
                @endif
            </tr>
        </table>

        <div class="rule"></div>

        <table>
            <tr>
                <td style="width: 50%;">
                    <div class="party-name">{{ $paper['seller']['name'] }}</div>
                    @foreach ($paper['seller']['lines'] as $line)
                        <div>{{ $line }}</div>
                    @endforeach
                </td>
                <td class="buyer" style="width: 50%;">
                    <div class="party-name">{{ $paper['buyer']['name'] }}</div>
                    @foreach ($paper['buyer']['lines'] as $line)
                        <div>{{ $line }}</div>
                    @endforeach
                </td>
            </tr>
        </table>

        @if ($paper['documentTitle'])
            <div class="doc-title">{{ $paper['documentTitle'] }}</div>
        @endif
        @if ($paper['description'])
            <div class="doc-description">{{ $paper['description'] }}</div>
        @endif

        <table class="lines">
            <thead>
                <tr>
                    <th>{{ $paper['head']['description'] }}</th>
                    <th class="num">{{ $paper['head']['quantity'] }}</th>
                    <th class="num">{{ $paper['head']['unitPrice'] }}</th>
                    <th class="num">{{ $paper['head']['vat'] }}</th>
                    <th class="num">{{ $paper['head']['total'] }}</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($paper['lines'] as $line)
                    <tr>
                        <td>
                            <div class="line-label">{{ $line['label'] }}</div>
                            @if ($line['detail'])
                                <div class="line-detail">{{ $line['detail'] }}</div>
                            @endif
                        </td>
                        <td class="num">{{ $line['quantity'] }}</td>
                        <td class="num">{{ $line['unitPrice'] }}</td>
                        <td class="num">{{ $line['vat'] }}</td>
                        <td class="num">{{ $line['total'] }}</td>
                    </tr>
                @empty
                    <tr><td class="empty" colspan="5">{{ $paper['noLinesLabel'] }}</td></tr>
                @endforelse
            </tbody>
        </table>

        <table class="summary">
            <tr>
                <td>
                    <table class="vat-table">
                        <tr>
                            <th>{{ $paper['vatHead']['base'] }}</th>
                            <th>{{ $paper['vatHead']['rate'] }}</th>
                            <th>{{ $paper['vatHead']['amount'] }}</th>
                        </tr>
                        @foreach ($paper['vatRows'] as $row)
                            <tr>
                                <td class="num">{{ $row['base'] }}</td>
                                <td>{{ $row['rate'] }}</td>
                                <td class="num">{{ $row['amount'] }}</td>
                            </tr>
                        @endforeach
                    </table>
                </td>
                <td>
                    <table class="totals-table">
                        @foreach ($paper['totals'] as $total)
                            <tr class="{{ $total['emphasis'] ? 'emphasis' : '' }}">
                                <td>{{ $total['label'] }}</td>
                                <td class="num">{{ $total['value'] }}</td>
                            </tr>
                        @endforeach
                    </table>
                </td>
            </tr>
        </table>

        @if ($paper['paymentTitle'])
            <div class="payment">
                <div class="payment-title">{{ $paper['paymentTitle'] }}</div>
                <div class="payment-rows">
                    @foreach ($paper['payment'] as $row)
                        <div><span class="meta-key">{{ $row['label'] }}{{ $paper['labelSeparator'] }}</span> {{ $row['value'] }}</div>
                    @endforeach
                </div>
            </div>
        @endif

        <div class="legal">{{ $paper['legal'] }}</div>
    </div>
</body>
</html>
