# Portal form fixtures

The adapters in `src/adapters/` are tested against captures of the real
portal forms, so a field the portal renames is caught here before it is
caught by a freelancer at filing time. The captures are made by hand, from a
logged-in session, and sanitized before they are committed.

| File | Portal | Page to capture |
| --- | --- | --- |
| `urssaf-form.html` | autoentrepreneur.urssaf.fr | the turnover declaration, form visible and empty |
| `ca3-form.html` | impots.gouv.fr (espace professionnel) | the 3310-CA3 télédéclaration, boxes visible |

## Capturing

1. Open the page with the form on screen, then in the devtools console run
   `copy(document.documentElement.outerHTML)` and paste into the file.
2. Strip every `<script>` and `<noscript>` element, every `on*=` handler
   attribute, and any stylesheet URL carrying a session token.
3. Redact the value of every hidden input, and every SIRET, SIREN, NIR, name,
   address, email, account number or session id in text nodes and in `href`,
   `action` and `src` attributes — replace with `REDACTED`.
4. **Keep** `id`, `name`, `type`, `inputmode`, `readonly`, `disabled`, `for`,
   `aria-*` and `data-*` attributes, the label and heading text, the table
   structure and the `<form>` element itself: that is what the adapters read.
5. Add a comment at the top with the URL path (no query string), the capture
   date, the browser, which boxes were editable versus computed, and how the
   portal displays an existing amount (`1234` or `1 234`).

Biome does not format this directory, so the captured markup stays byte-exact.
