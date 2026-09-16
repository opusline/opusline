/** A document built from markup, detached from the test's own `document`. */
export function documentFrom(markup: string): Document {
  return new DOMParser().parseFromString(
    `<!doctype html><html><body>${markup}</body></html>`,
    "text/html",
  );
}

export function fakeLocation(hash: string): Location {
  return {
    hash,
    pathname: "/portail/accueil.html",
    search: "",
  } as Location;
}
