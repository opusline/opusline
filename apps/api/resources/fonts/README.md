# PDF fonts

dompdf embeds fonts from the filesystem and cannot read woff2, so the brand faces the app
loads over the web (`@fontsource-variable/{lora,geist}`) are unusable for the CRA PDF. These
are the static TTF instances of the same families, in the Latin subset — verified to cover
French accents, `œ`, `€` and the typographic apostrophe.

| File | Used for |
|---|---|
| `Lora-Regular.ttf`, `Lora-SemiBold.ttf` | headings, matching `--font-display` |
| `Geist-Regular.ttf`, `Geist-Medium.ttf` | body copy and figures |

Both families are licensed under the SIL Open Font License 1.1, which is compatible with this
project's AGPL-3.0. The OFL requires the copyright and licence notice to travel with the fonts,
so `OFL.txt` carries the licence text once and **both** copyright notices — Lora's (Reserved
Font Name "Lora") and Geist's (Vercel). Adding a face here means adding its copyright line
there too; do not delete either.

Sourced from Google Fonts' static per-weight builds. To refresh a face, download the same
weight and drop it in; `resources/views/cra/document.blade.php` refers to these by path.
