import { client } from "@opusline/api-client/client";

import { readCookie } from "./cookies";

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

    return request;
  });
}
