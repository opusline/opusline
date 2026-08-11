/**
 * Serialises the debounced note writes.
 *
 * Two saves can otherwise be in flight at once, and if the older one lands
 * second the note reverts to what the user already replaced. `settle` lets a
 * stop or discard wait for the queue to drain, so a write typed for one timer
 * cannot land on the next one.
 */
export type NoteQueue = {
  push: (write: () => Promise<unknown>) => void;
  settle: () => Promise<void>;
};

export function createNoteQueue(): NoteQueue {
  let chain: Promise<unknown> = Promise.resolve();

  return {
    push: (write) => {
      // The catch goes last so the stored chain is always settled: a failed
      // write with nothing queued behind it would otherwise be reported as an
      // unhandled rejection.
      chain = chain.then(write).catch(() => undefined);
    },
    settle: async () => {
      await chain;
    },
  };
}
