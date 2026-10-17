{{--
    A client e-mail as the design lays it out (InvoiceEmail canvas): the
    account's logo or initials, the greeting and the paragraphs the template
    produced, a summary card with the amount, its flag and a few rows, the
    attachment, how to pay when the e-mail asks for money, the signature, and
    a one-line footer naming the instance.

    E-mail clients ignore stylesheets, so every style is inline and every
    side-by-side block is a table. Colours are the design's solid hex values.
--}}
<!DOCTYPE html>
<html lang="{{ $content->locale }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $content->subject }}</title>
</head>
<body style="margin:0; padding:0; background:#EFEBE5; font-family: Geist, system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif; color:#332E29; font-size:14px; line-height:1.65;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFEBE5; padding:28px 20px 24px;">
    <tr>
        <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#FFFFFF; border:1px solid #E6E1D9; border-radius:6px;">
                @if ($content->isTest)
                    <tr>
                        <td style="padding:10px 28px; background:#FBF3E4; color:#7A5A1A; font-size:12.5px; border-bottom:1px solid #F0E2C4;">
                            {{ __('client_mail.test.banner', ['kind' => $content->cardLabel], $content->locale) }}
                        </td>
                    </tr>
                @endif
                <tr>
                    <td style="padding:22px 28px 0;">
                        @if ($logo !== null && isset($message))
                            <img src="{{ $message->embed($logo->getPath()) }}" alt="{{ $content->senderName }}" style="display:block; max-width:120px; max-height:40px;">
                        @else
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="width:34px; height:34px; border-radius:17px; background:#1D1A17; color:#FFFFFF; font-weight:600; font-size:12px; letter-spacing:0.02em; text-align:center; vertical-align:middle;">{{ $initials }}</td>
                                    <td style="padding-left:12px; font-size:14px; font-weight:600; color:#1D1A17;">{{ $content->senderName }}</td>
                                </tr>
                            </table>
                        @endif
                    </td>
                </tr>
                <tr>
                    <td style="padding:22px 28px 6px; font-size:14px; line-height:1.65; color:#332E29;">
                        @if ($content->greeting !== '')
                            <div style="margin-bottom:12px;">{{ $content->greeting }}</div>
                        @endif
                        @foreach ($content->paragraphs as $paragraph)
                            <p style="margin:0 0 12px; white-space:pre-wrap;">{{ $paragraph }}</p>
                        @endforeach
                    </td>
                </tr>
                <tr>
                    <td style="padding:6px 28px 0;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E6E1D9; border-radius:6px;">
                            <tr>
                                <td style="padding:14px 16px 12px; background:#FAF8F5; border-bottom:1px solid #EFEBE5;">
                                    <div style="font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:#8A8179;">{{ $content->cardLabel }}</div>
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px;">
                                        <tr>
                                            <td style="font-size:24px; font-weight:600; letter-spacing:-0.01em; font-variant-numeric: tabular-nums; color:#141210;">{{ $content->amount }}</td>
                                            @if ($content->flag !== null)
                                                <td align="right" style="vertical-align:baseline;">
                                                    <span style="display:inline-block; font-size:12px; padding:3px 8px; border-radius:3px; white-space:nowrap; {{ $content->flag['tone'] === 'late' ? 'background:#FBEDE6; color:#A6512E;' : 'background:#F1EDE6; color:#574F47;' }}">{{ $content->flag['label'] }}</span>
                                                </td>
                                            @endif
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            @foreach ($content->rows as $row)
                                <tr>
                                    <td style="padding:9px 16px; border-bottom:1px solid #F1EDE6; font-size:13px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="color:#7A716A;">{{ $row['label'] }}</td>
                                                <td align="right" style="color:#1D1A17; font-variant-numeric: tabular-nums;">{{ $row['value'] }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            @endforeach
                            <tr>
                                <td style="padding:14px 16px;">
                                    <table role="presentation" cellpadding="0" cellspacing="0" style="border:1px solid #E6E1D9; border-radius:5px;">
                                        <tr>
                                            <td style="padding:9px 11px;">
                                                <table role="presentation" cellpadding="0" cellspacing="0">
                                                    <tr>
                                                        <td style="width:28px; height:32px; border-radius:3px; background:#F1EDE6; color:#A6512E; font-size:9px; font-weight:700; letter-spacing:0.04em; text-align:center; vertical-align:middle;">PDF</td>
                                                        <td style="padding-left:10px;">
                                                            <div style="font-size:13px; color:#1D1A17;">{{ $content->attachmentName }}</div>
                                                            <div style="font-size:11.5px; color:#8A8179;">{{ __('client_mail.card.attachment', [], $content->locale) }}</div>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                @if ($content->payment !== null)
                    <tr>
                        <td style="padding:14px 28px 0; font-size:12.5px; line-height:1.6; color:#574F47;">
                            <div style="font-weight:600; color:#332E29; margin-bottom:2px;">{{ __('client_mail.payment.title', [], $content->locale) }}</div>
                            <div>{{ __('client_mail.payment.iban', [], $content->locale) }} : <span style="font-family: 'Geist Mono', ui-monospace, Menlo, monospace; font-size:12px; color:#1D1A17;">{{ $content->payment['iban'] }}</span></div>
                            @if ($content->payment['bic'] !== null)
                                <div>{{ __('client_mail.payment.bic', [], $content->locale) }} : <span style="font-family: 'Geist Mono', ui-monospace, Menlo, monospace; font-size:12px; color:#1D1A17;">{{ $content->payment['bic'] }}</span></div>
                            @endif
                            <div>{{ __('client_mail.payment.reference', [], $content->locale) }} : <span style="font-family: 'Geist Mono', ui-monospace, Menlo, monospace; font-size:12px; color:#1D1A17;">{{ $content->payment['reference'] }}</span></div>
                        </td>
                    </tr>
                @endif
                <tr>
                    <td style="padding:20px 28px 24px; font-size:14px; line-height:1.6; color:#332E29;">
                        <div style="font-weight:600; color:#1D1A17;">{{ $content->senderName }}</div>
                        @foreach ($content->signature as $line)
                            <div style="font-size:12.5px; color:#7A716A;">{{ $line }}</div>
                        @endforeach
                    </td>
                </tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; margin-top:14px;">
                <tr>
                    <td align="center" style="font-size:11px; line-height:1.55; color:#8A8179;">{{ $content->footer }}</td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
