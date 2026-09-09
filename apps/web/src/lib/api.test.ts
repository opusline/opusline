import { client } from "@opusline/api-client/client";
import { afterEach, expect, it, vi } from "vitest";

import { setupApiClient } from "./api";

setupApiClient();
// The app's base is the relative `/api` the browser resolves; Node's Request
// cannot, so the tests keep the generated absolute default.
client.setConfig({ baseUrl: "http://localhost/api" });

function stubResponse(status: number, body: string, type: string) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = input instanceof Request ? input.url : String(input);

      return url.includes("csrf-cookie")
        ? new Response(null, { status: 204 })
        : new Response(body, { status, headers: { "Content-Type": type } });
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("stamps the HTTP status on a refused JSON body", async () => {
  stubResponse(
    423,
    JSON.stringify({ message: "Confirmez." }),
    "application/json",
  );

  await expect(
    client.post({ url: "/user/two-factor/totp", throwOnError: true }),
  ).rejects.toMatchObject({ message: "Confirmez.", status: 423 });
});

it("leaves a non-JSON error body alone so the fallback message wins", async () => {
  stubResponse(502, "<html>Bad gateway</html>", "text/html");

  await expect(
    client.get({ url: "/user/two-factor", throwOnError: true }),
  ).rejects.toBe("<html>Bad gateway</html>");
});
