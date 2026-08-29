{{--
    The document's four faces, shared with RenderCraPdf::warmFontCache() so the
    warm-up can never drift from what the real render loads.
--}}
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
