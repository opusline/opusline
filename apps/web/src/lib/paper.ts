/**
 * The palette of surfaces that paint on paper rather than in the theme — the CRA
 * document and the signature preview. Written out in hex on purpose: paper does
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
