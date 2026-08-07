/**
 * Inline stand-in logo for stories and tests — the real one is streamed from
 * the API, which neither of them can reach.
 */
export const SAMPLE_LOGO_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 72">
    <rect width="120" height="72" fill="none"/>
    <circle cx="30" cy="36" r="18" fill="#BA7517"/>
    <text x="56" y="44" font-family="Georgia,serif" font-size="22" fill="#8A827A">Nordlys</text>
  </svg>`,
)}`;
