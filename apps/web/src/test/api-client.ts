import { client } from "@opusline/api-client/client";
import { afterAll, beforeAll } from "vitest";

import { setupApiClient } from "@/lib/api";

/**
 * Wires the API client the way the app does at boot, for the suites whose
 * subject runs through its interceptors, and unwires it once the file is done.
 *
 * The client is a module singleton and the suite runs with `isolate: false`:
 * interceptors a file registered used to outlive it, and every later file in
 * the same worker then sent its writes through the CSRF preflight — a relative
 * URL its fetch stub could not build a Request from — failing whichever
 * mutation tests the worker happened to run next.
 */
export function wireAppApiClient(): void {
  const generatedConfig = client.getConfig();

  beforeAll(() => {
    setupApiClient();
    // The app's relative "/api" base is a browser trick Node's Request cannot
    // repeat, so the suites keep the generated absolute one.
    client.setConfig({ baseUrl: "http://localhost/api" });
  });

  afterAll(() => {
    client.interceptors.request.clear();
    client.interceptors.response.clear();
    client.interceptors.error.clear();
    client.setConfig(generatedConfig);
  });
}
