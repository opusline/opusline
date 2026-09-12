import type { AnyRouter } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

const sentry = vi.hoisted(() => ({
  init: vi.fn(),
  captureException: vi.fn(),
  setUser: vi.fn(),
  tanstackRouterBrowserTracingIntegration: vi.fn(() => ({ name: "tanstack" })),
}));

vi.mock("@sentry/react", () => sentry);

const router = {} as AnyRouter;
const config = {
  dsn: "https://key@sentry.example/1",
  environment: "staging",
  tracesSampleRate: 0.2,
};

// The facade keeps module state and isolate:false shares modules across
// files, so every test starts from a fresh copy.
async function freshMonitoring() {
  vi.resetModules();
  return import("./monitoring");
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("reportError", () => {
  it("parks errors until Sentry is loaded, then flushes them", async () => {
    const monitoring = await freshMonitoring();
    const boom = new Error("boom");

    monitoring.reportError(boom, { handled: false });
    expect(sentry.captureException).not.toHaveBeenCalled();

    await monitoring.startMonitoring(config, router);

    expect(sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: config.dsn,
        environment: "staging",
        tracesSampleRate: 0.2,
        sendDefaultPii: false,
      }),
    );
    expect(sentry.tanstackRouterBrowserTracingIntegration).toHaveBeenCalledWith(
      router,
    );
    expect(sentry.captureException).toHaveBeenCalledWith(
      boom,
      expect.objectContaining({
        mechanism: { type: "generic", handled: false },
      }),
    );
  });

  it("forwards straight to Sentry once loaded", async () => {
    const monitoring = await freshMonitoring();
    await monitoring.startMonitoring(config, router);

    monitoring.reportError(new Error("later"));

    expect(sentry.captureException).toHaveBeenCalledOnce();
  });

  it("drops parked errors when the instance has no DSN", async () => {
    const monitoring = await freshMonitoring();
    monitoring.reportError(new Error("boom"));

    await monitoring.startMonitoring(null, router);

    expect(sentry.init).not.toHaveBeenCalled();
    expect(sentry.captureException).not.toHaveBeenCalled();
  });

  it("leaves a failed API call to the query cache, even when a loader rethrows it", async () => {
    const monitoring = await freshMonitoring();
    await monitoring.startMonitoring(config, router);

    monitoring.reportError({
      message: "Server Error",
      status: 503,
      method: "GET",
      route: "/clients",
    });

    expect(sentry.captureException).not.toHaveBeenCalled();
  });

  it("still reports an unrelated error that merely carries a status", async () => {
    const monitoring = await freshMonitoring();
    await monitoring.startMonitoring(config, router);

    monitoring.reportError({ status: 500 });

    expect(sentry.captureException).toHaveBeenCalledOnce();
  });
});

describe("setMonitoredUser", () => {
  it("replays the user set before Sentry loaded, as an id only", async () => {
    const monitoring = await freshMonitoring();
    monitoring.setMonitoredUser({ id: 7 });

    await monitoring.startMonitoring(config, router);
    expect(sentry.setUser).toHaveBeenCalledWith({ id: "7" });

    monitoring.setMonitoredUser(null);
    expect(sentry.setUser).toHaveBeenLastCalledWith(null);
  });
});

describe("reportApiFailure", () => {
  it.each([400, 401, 422, 423])(
    "ignores a %i: the UI already shows it",
    async (status) => {
      const monitoring = await freshMonitoring();
      await monitoring.startMonitoring(config, router);

      monitoring.reportApiFailure({
        message: "no",
        status,
        method: "POST",
        route: "/clients",
      });

      expect(sentry.captureException).not.toHaveBeenCalled();
    },
  );

  it("ignores an aborted request", async () => {
    const monitoring = await freshMonitoring();
    await monitoring.startMonitoring(config, router);

    monitoring.reportApiFailure(new DOMException("Aborted", "AbortError"));

    expect(sentry.captureException).not.toHaveBeenCalled();
  });

  it("wraps a 5xx into an Error titled after the route template", async () => {
    const monitoring = await freshMonitoring();
    await monitoring.startMonitoring(config, router);

    monitoring.reportApiFailure({
      message: "Server Error",
      status: 503,
      method: "GET",
      route: "/clients/{client}",
    });

    expect(sentry.captureException).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "ApiFailure",
        message: "API 503 GET /clients/{client}",
      }),
      expect.objectContaining({
        captureContext: expect.objectContaining({
          fingerprint: ["api", "503", "GET", "/clients/{client}"],
        }),
      }),
    );
  });

  it("reports a request that never got a response", async () => {
    const monitoring = await freshMonitoring();
    await monitoring.startMonitoring(config, router);

    monitoring.reportApiFailure(new TypeError("Failed to fetch"));

    expect(sentry.captureException).toHaveBeenCalledWith(
      expect.objectContaining({ message: "API request failed" }),
      expect.anything(),
    );
  });
});
