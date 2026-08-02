import { client } from "@opusline/api-client/client";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

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
