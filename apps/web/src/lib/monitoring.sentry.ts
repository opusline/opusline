import * as Sentry from "@sentry/react";
import type { AnyRouter } from "@tanstack/react-router";
import type { MonitoringBackend, MonitoringConfig } from "./monitoring";
import { isApiClientError } from "./validation";
import { APP_VERSION } from "./version";

/**
 * The one module that imports @sentry/react. It is reached only through the
 * dynamic import in monitoring.ts, which keeps the SDK out of the entry chunk
 * (scripts/check-bundle-budget.mjs is the wall); a static import from anywhere
 * would make Rollup hoist it back in.
 */
export function createSentryBackend(
  config: MonitoringConfig,
  router: AnyRouter,
): MonitoringBackend {
  Sentry.init({
    dsn: config.dsn,
    release: APP_VERSION,
    environment: config.environment,
    tracesSampleRate: config.tracesSampleRate,
    sendDefaultPii: false,
    integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
    // The default global handlers also see unhandled promise rejections,
    // where an un-awaited mutateAsync() would surface a raw API failure;
    // reportApiFailure is the one place those are judged and shaped.
    beforeSend(event, hint) {
      return isApiClientError(hint.originalException) ? null : event;
    },
  });

  return {
    reportError(error, context) {
      Sentry.captureException(error, {
        mechanism: { type: "generic", handled: context?.handled ?? true },
        captureContext: {
          fingerprint: context?.fingerprint,
          contexts: context?.componentStack
            ? { react: { componentStack: context.componentStack } }
            : undefined,
        },
      });
    },
    setUser(user) {
      Sentry.setUser(user ? { id: String(user.id) } : null);
    },
  };
}
