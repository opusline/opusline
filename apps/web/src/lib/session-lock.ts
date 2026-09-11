/**
 * The one channel between "the API just said 401" and the screen that asks for
 * the password again.
 *
 * A module-level slot rather than a context because the API client is configured
 * once, at boot, outside React — and the alternative is threading a queryClient
 * callback through setupApiClient, which would make every call site of the client
 * aware of a lock screen it has nothing to do with.
 */
let listener: (() => void) | null = null;

/** Returns the unsubscribe, so a remount never leaves two listeners behind. */
export function onSessionExpired(handler: () => void): () => void {
  listener = handler;

  return () => {
    if (listener === handler) {
      listener = null;
    }
  };
}

export function reportSessionExpired(): void {
  listener?.();
}

/**
 * How long the app sits untouched before it locks itself.
 *
 * Half an hour: long enough that reading a long invoice list is not interrupted,
 * short enough that a laptop left open in a café is not an open account. The
 * server session usually outlives it, so unlocking is a password check rather
 * than a fresh login.
 */
export const INACTIVITY_LOCK_MS = 30 * 60 * 1000;
