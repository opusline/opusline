import { client } from "@opusline/api-client/client";
import { readCookie } from "./cookies";
import { apiLocaleFor, currentUiLocale } from "./i18n";
import { reportSessionExpired } from "./session-lock";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function setupApiClient() {
  client.setConfig({ baseUrl: "/api" });

  client.interceptors.request.use(async (request) => {
    if (MUTATING_METHODS.has(request.method) && !readCookie("XSRF-TOKEN")) {
      await fetch("/sanctum/csrf-cookie", {
        headers: { Accept: "application/json" },
      });
    }

    const token = readCookie("XSRF-TOKEN");
    if (token) {
      request.headers.set("X-XSRF-TOKEN", token);
    }

    request.headers.set("Accept", "application/json");
    request.headers.set("Accept-Language", apiLocaleFor(currentUiLocale()));

    return request;
  });

  // A session that died under a screen the user is still looking at: the lock
  // asks for the password there rather than throwing the page away. Reported
  // rather than acted on — whether there is a session to lose is something only
  // the React side knows.
  client.interceptors.response.use((response) => {
    if (response.status === 401) {
      reportSessionExpired();
    }

    return response;
  });

  // The client throws the parsed body alone; the status is what tells a
  // "confirm your password first" 423 apart from a refused write. Only a
  // JSON body is stamped: a proxy's text page must keep falling through to
  // the localized fallback rather than surface as a message.
  client.interceptors.error.use((error, response) =>
    typeof error === "object" && error !== null && response !== undefined
      ? { ...error, status: response.status }
      : error,
  );
}
