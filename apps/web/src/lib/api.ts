import { client } from "@opusline/api-client/client";
import { readCookie } from "./cookies";
import { apiLocaleFor, currentUiLocale } from "./i18n";
import { reportSessionExpired } from "./session-lock";
import type { ApiErrorStamp } from "./validation";

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
  // "confirm your password first" 423 apart from a refused write, and the
  // verb plus the unresolved route template let monitoring name a failure
  // without leaking ids. A proxy's text page is dropped rather than kept as
  // the body, so it falls through to the localized fallback instead of
  // surfacing as a message.
  client.interceptors.error.use((error, response, request, options) =>
    response === undefined || request === undefined
      ? error
      : stampApiError(error, {
          status: response.status,
          method: request.method,
          route: options.url,
        }),
  );
}

/** The object a refused request rejects with: the JSON body, if any, plus the stamp. */
export function stampApiError(body: unknown, stamp: ApiErrorStamp): object {
  return typeof body === "object" && body !== null
    ? { ...body, ...stamp }
    : stamp;
}
