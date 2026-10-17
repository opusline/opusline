{{--
    A client e-mail as the design (InvoiceEmail canvas) lays it out: the
    account's logo or initials, the body the template produced, a summary card
    of the document, the payment block when the document is to be paid, the
    account's signature, and a one-line footer naming the instance.

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
<body style="margin:0; padding:0; background:#F4F1EC; font-family: 'Geist', 'Helvetica Neue', Arial, sans-serif; color:#1D1A17; font-size:15px; line-height:1.55;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EC; padding:32px 16px;">
    <tr>
        <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#FFFFFF; border:1px solid #E6E1D9; border-radius:8px; overflow:hidden;">
                <tr>
                    <td style="height:3px; background:#BA7517; line-height:3px; font-size:0;">&nbsp;</td>
                </tr>
                @if ($content->isTest)
                    <tr>
                        <td style="padding:12px 32px; background:#FBF3E4; color:#7A5A1A; font-size:13px; border-bottom:1px solid #F0E2C4;">
                            {{ __('client_mail.test.banner', ['kind' => $content->cardTitle], $content->locale) }}
                        </td>
                    </tr>
                @endif
                <tr>
                    <td style="padding:28px 32px 0;">
                        @if ($logo !== null && isset($message))
                            <img src="{{ $message->embed($logo->getPath()) }}" alt="{{ $sender->settingsOrFail()->trade_name ?? $sender->name }}" style="display:block; max-width:160px; max-height:56px;">
                        @else
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="width:44px; height:44px; border-radius:22px; background:#F4EBDD; color:#8A5A12; font-weight:600; font-size:15px; text-align:center; vertical-align:middle; letter-spacing:0.04em;">{{ $initials }}</td>
                                    <td style="padding-left:12px; font-weight:600; color:#141210;">{{ $sender->settingsOrFail()->trade_name ?? $sender->name }}</td>
                                </tr>
                            </table>
                        @endif
                    </td>
                </tr>
                <tr>
                    <td style="padding:24px 32px 0; white-space:pre-wrap;">{{ $content->body }}</td>
                </tr>
                <tr>
                    <td style="padding:24px 32px 0;">
                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F4; border:1px solid #E6E1D9; border-radius:6px;">
                            <tr>
                                <td style="padding:16px 18px 6px;">
                                    <div style="font-weight:600; color:#141210; font-size:15px;">{{ $content->cardTitle }}</div>
                                    @if ($content->cardSubtitle !== null)
                                        <div style="color:#574F47; font-size:13px; margin-top:2px;">{{ $content->cardSubtitle }}</div>
                                    @endif
                                </td>
                            </tr>
                            @foreach ($content->cardRows as $row)
                                <tr>
                                    <td style="padding:6px 18px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="color:#7A716A; font-size:13px;">{{ $row['label'] }}</td>
                                                <td align="right" style="color:#141210; font-weight:600; font-size:14px; font-variant-numeric: tabular-nums;">{{ $row['value'] }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            @endforeach
                            <tr>
                                <td style="padding:8px 18px 16px; color:#7A716A; font-size:12px;">{{ __('client_mail.card.attached', [], $content->locale) }}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
                @if ($content->payment !== null)
                    <tr>
                        <td style="padding:20px 32px 0;">
                            <div style="font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color:#7A716A; font-weight:600;">{{ __('client_mail.payment.title', [], $content->locale) }}</div>
                            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:8px; font-size:14px;">
                                <tr>
                                    <td style="color:#7A716A; padding-right:16px;">{{ __('client_mail.payment.iban', [], $content->locale) }}</td>
                                    <td style="font-family: ui-monospace, 'Geist Mono', Menlo, monospace; color:#141210;">{{ $content->payment['iban'] }}</td>
                                </tr>
                                @if ($content->payment['bic'] !== null)
                                    <tr>
                                        <td style="color:#7A716A; padding-right:16px;">{{ __('client_mail.payment.bic', [], $content->locale) }}</td>
                                        <td style="font-family: ui-monospace, 'Geist Mono', Menlo, monospace; color:#141210;">{{ $content->payment['bic'] }}</td>
                                    </tr>
                                @endif
                            </table>
                            <div style="margin-top:6px; color:#574F47; font-size:13px;">{{ $content->payment['reference'] }}</div>
                        </td>
                    </tr>
                @endif
                <tr>
                    <td style="padding:28px 32px 28px; color:#7A716A; font-size:12px; border-top:1px solid #E6E1D9; margin-top:24px;">
                        {{ __('client_mail.footer', ['name' => $sender->settingsOrFail()->trade_name ?? $sender->name], $content->locale) }}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
