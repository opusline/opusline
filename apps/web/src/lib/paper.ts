/**
 * The palette of surfaces that paint on paper rather than in the theme — the CRA
 * and invoice documents and the signature preview. Written out in hex on purpose: paper does
 * not follow the user's dark mode. The CRA document's twin is
 * apps/api/resources/views/cra/document.blade.php; both are fed by the same
 * payload, so only the styling lives in two places.
 */
export const PAPER = {
  sheet: "#FBFAF7",
  ink: "#111111",
  quiet: "#555555",
  faint: "#666666",
  rule: "#E4E4E4",
  closed: "#F2F2F2",
  worked: "#FBF2E4",
  workedBorder: "#E4CDA6",
  offDay: "#F6E4C6",
  offDayBorder: "#D4AE72",
} as const;

/**
 * The invoice sheet's own tones, from the design's InvoicePaper; its twin is
 * apps/api/resources/views/invoices/document.blade.php.
 */
export const INVOICE_PAPER = {
  sheet: "#FFFFFF",
  bar: "#BA7517",
  ink: "#1D1A17",
  strong: "#141210",
  body: "#332E29",
  soft: "#574F47",
  quiet: "#6A615A",
  // The design's #988F86 reads at 3.2:1 on white; this is the nearest tone
  // that clears WCAG AA for small text (4.6:1).
  faint: "#7C736B",
  head: "#F1EDE6",
  emphasis: "#F4F1EB",
  rule: "#E6E1D9",
  ruleSoft: "#EFEBE5",
  stamp: "#D8D1C7",
  stampInk: "#7A716A",
} as const;
