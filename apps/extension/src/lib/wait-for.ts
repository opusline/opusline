export class WaitTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`nothing matched within ${timeoutMs} ms`);
    this.name = "WaitTimeoutError";
  }
}

/**
 * Resolves with the first non-null probe result, re-probing on every DOM
 * mutation. The portals render their forms from scripts, often several
 * in-page navigations after the login, so the probe watches the whole
 * document rather than a node that may not exist yet.
 */
export function waitFor<T>(
  probe: () => T | null,
  { timeoutMs, target }: { timeoutMs: number; target: Node },
): Promise<T> {
  return new Promise((resolve, reject) => {
    const initial = probe();
    if (initial !== null) {
      resolve(initial);
      return;
    }

    const observer = new MutationObserver(() => {
      const found = probe();
      if (found !== null) {
        stop();
        resolve(found);
      }
    });
    const timer = setTimeout(() => {
      stop();
      reject(new WaitTimeoutError(timeoutMs));
    }, timeoutMs);

    function stop() {
      observer.disconnect();
      clearTimeout(timer);
    }

    observer.observe(target, { childList: true, subtree: true });
  });
}
