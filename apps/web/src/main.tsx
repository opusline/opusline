import { getPingOptions } from "@opusline/api-client/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import type { ErrorInfo } from "react";
import ReactDOM from "react-dom/client";
import { setupApiClient } from "@/lib/api";
import {
  type MonitoringConfig,
  reportError,
  startMonitoring,
} from "@/lib/monitoring";
import "@/lib/zod";
import "@/lib/i18n";
import { getRouter } from "./router";

const PING_RETRY_MS = 30_000;

setupApiClient();

const router = getRouter();
const { queryClient } = router.options.context;

// Ping says whether this instance reports to Sentry. It shares the cache with
// /health and runs alongside the layouts' current-user fetch; nothing below
// waits on it, so first paint is unchanged. An API that is down at boot is
// asked again until it answers: only its answer decides whether monitoring
// starts, never the outage. The loop rather than a query-level retry, so the
// shared cache entry still errors for /health.
async function resolveMonitoringConfig(): Promise<MonitoringConfig | null> {
  for (;;) {
    try {
      return (await queryClient.ensureQueryData(getPingOptions())).sentry;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, PING_RETRY_MS));
    }
  }
}

resolveMonitoringConfig()
  .then((config) => startMonitoring(config, router))
  .catch((error: unknown) => {
    console.warn("Monitoring did not start", error);
  });

// Providing the root handlers replaces React's own console reporting, hence
// the console.error before each report.
const reportReactError =
  (handled: boolean) => (error: unknown, info: ErrorInfo) => {
    console.error(error);
    reportError(error, {
      componentStack: info.componentStack ?? undefined,
      handled,
    });
  };

const rootElement = document.getElementById("app")!;

// A marker rather than an emptiness check: #app ships with the static shell
// from index.html, which React replaces on mount.
if (!rootElement.dataset.mounted) {
  rootElement.dataset.mounted = "true";
  const root = ReactDOM.createRoot(rootElement, {
    onUncaughtError: reportReactError(false),
    onCaughtError: reportReactError(true),
    onRecoverableError: reportReactError(true),
  });
  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
