import type { Portal } from "./payload";

/**
 * Where a « Pré-remplir » link lands. Each is a public page that answers 200
 * on the portal's own host: the extension's content script reads the fragment
 * at document_start, so a server redirect (the authenticated spaces all 302
 * to a login host) would drop it before any script runs.
 */
export const PORTALS: Record<Portal, { url: string }> = {
  urssaf: {
    url: "https://www.autoentrepreneur.urssaf.fr/portail/accueil.html",
  },
  impots: { url: "https://www.impots.gouv.fr/accueil" },
};
