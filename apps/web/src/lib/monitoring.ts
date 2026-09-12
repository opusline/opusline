import type { AnyRouter } from "@tanstack/react-router";
import { isApiClientError, serverRequest, serverStatus } from "./validation";

/** What GET /api/ping answers when the instance is configured for Sentry. */
export type MonitoringConfig = {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
};

export type ErrorContext = {
  componentStack?: string;
  /** false when nothing caught the error (React's onUncaughtError). */
  handled?: boolean;
  fingerprint?: string[];
};

export type MonitoredUser = { id: number } | null;

/** The slice of Sentry the app talks to; monitoring.sentry.ts implements it. */
export type MonitoringBackend = {
  reportError: (error: unknown, context?: ErrorContext) => void;
  setUser: (user: MonitoredUser) => void;
};

const PENDING_CAP = 20;

let backend: MonitoringBackend | null = null;
let disabled = false;
let user: MonitoredUser = null;
let pending: Array<[unknown, ErrorContext | undefined]> = [];

/**
 * Forwards to Sentry once it is loaded; until then the error is parked, so a
 * crash during boot still reaches Sentry once the ping has answered. A failed
 * API call is not reported here even when a loader rethrows it into a
 * boundary: reportApiFailure already did, once, from the query cache.
 */
export function reportError(error: unknown, context?: ErrorContext): void {
  if (disabled || isApiClientError(error)) {
    return;
  }

  if (backend) {
    backend.reportError(error, context);
  } else if (pending.length < PENDING_CAP) {
    pending.push([error, context]);
  }
}

export function setMonitoredUser(next: MonitoredUser): void {
  user = next;
  backend?.setUser(next);
}

/**
 * Pulls Sentry into its own chunk when the instance has a DSN. Nothing on the
 * render path awaits this.
 */
export async function startMonitoring(
  config: MonitoringConfig | null,
  router: AnyRouter,
): Promise<void> {
  if (config === null) {
    disabled = true;
    pending = [];
    return;
  }

  const { createSentryBackend } = await import("./monitoring.sentry");
  backend = createSentryBackend(config, router);
  backend.setUser(user);
  for (const [error, context] of pending.splice(0)) {
    backend.reportError(error, context);
  }
}

/**
 * Reports a failed API call only when the server or the network is at fault:
 * a 4xx is the app being told no, and the UI already shows that; an abort is
 * the app changing its mind. The plain object the api client throws becomes
 * a real Error so Sentry gets a stack and a stable title such as
 * `API 503 GET /clients/{client}`.
 */
export function reportApiFailure(error: unknown): void {
  if (disabled) {
    return;
  }

  const status = serverStatus(error);
  if (status !== null && status < 500) {
    return;
  }
  if (error instanceof DOMException && error.name === "AbortError") {
    return;
  }

  const method = serverRequest(error)?.method ?? "?";
  const route = serverRequest(error)?.route ?? "?";
  const label = status === null ? "failure" : String(status);
  const failure = new Error(
    status === null ? "API request failed" : `API ${status} ${method} ${route}`,
    { cause: error },
  );
  failure.name = "ApiFailure";

  reportError(failure, { fingerprint: ["api", label, method, route] });
}
