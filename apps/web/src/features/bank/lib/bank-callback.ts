import { useEffect, useRef } from "react";

/** The query string the bank sends the browser back to Compte pro with. */
export type BankCallbackSearch = {
  code?: string;
  state?: string;
  error?: string;
};

function callbackParam(value: unknown): string | undefined {
  return typeof value === "string" && value !== "" && value.length <= 2048
    ? value
    : undefined;
}

export function parseBankCallbackSearch(
  search: Record<string, unknown>,
): BankCallbackSearch {
  return {
    code: callbackParam(search.code),
    state: callbackParam(search.state),
    error: callbackParam(search.error),
  };
}

type BankCallbackHandlers = {
  complete: (authorization: { code: string; state: string }) => void;
  /** The user backed out at the bank, or the bank refused. */
  cancel: () => void;
  /** This tab already sent this authorization — a reload while it was in flight. */
  replayed: () => void;
};

const HANDLED_STATE_KEY = "bank-authorization-handled";

/**
 * The state is single use on the server, so a second send can only fail — and
 * a reload of the callback URL before the route drops its query string would
 * send it again. The tab's session storage remembers the last one sent; where
 * storage is unavailable, the in-memory guard below still covers re-renders.
 */
function wasSentFromThisTab(state: string): boolean {
  try {
    return sessionStorage.getItem(HANDLED_STATE_KEY) === state;
  } catch {
    return false;
  }
}

function rememberSent(state: string): void {
  try {
    sessionStorage.setItem(HANDLED_STATE_KEY, state);
  } catch {
    // Storage refused (private mode, quota): only a reload can replay it.
  }
}

/**
 * Hands the bank's answer over once per authorization, whatever StrictMode's
 * replayed effect, a re-render or a reload of the callback URL repeats.
 */
export function useBankAuthorizationCallback(
  search: BankCallbackSearch,
  handlers: BankCallbackHandlers,
): void {
  const handled = useRef<string | null>(null);

  useEffect(() => {
    const answer = search.state ?? search.error;

    if (answer === undefined || handled.current === answer) {
      return;
    }

    handled.current = answer;

    if (search.error !== undefined) {
      handlers.cancel();

      return;
    }

    if (search.code === undefined || search.state === undefined) {
      return;
    }

    if (wasSentFromThisTab(search.state)) {
      handlers.replayed();

      return;
    }

    rememberSent(search.state);
    handlers.complete({ code: search.code, state: search.state });
  }, [search, handlers]);
}
