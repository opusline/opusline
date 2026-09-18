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
};

/**
 * Hands the bank's answer over once per authorization. The state is single
 * use on the server, so StrictMode's replayed effect — or any re-render
 * before the route drops the query string — must not send it twice.
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

    if (search.code !== undefined && search.state !== undefined) {
      handlers.complete({ code: search.code, state: search.state });
    }
  }, [search, handlers]);
}
