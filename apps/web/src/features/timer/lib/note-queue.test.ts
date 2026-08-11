import { expect, it, vi } from "vitest";

import { createNoteQueue } from "./note-queue";

function deferred() {
  let resolve: () => void = () => undefined;
  const promise = new Promise<void>((settle) => {
    resolve = settle;
  });

  return { promise, resolve };
}

it("runs writes in the order they were queued", async () => {
  const queue = createNoteQueue();
  const order: string[] = [];
  const first = deferred();

  queue.push(async () => {
    await first.promise;
    order.push("first");
  });
  queue.push(async () => {
    order.push("second");
  });

  first.resolve();
  await queue.settle();

  expect(order).toEqual(["first", "second"]);
});

/** A refused note must not strand every later one behind it. */
it("keeps draining after a write fails", async () => {
  const queue = createNoteQueue();
  const after = vi.fn();

  queue.push(() => Promise.reject(new Error("refused")));
  queue.push(async () => {
    after();
  });

  await queue.settle();

  expect(after).toHaveBeenCalledTimes(1);
});

/** Stop and discard wait on this so a stale note cannot reach the next timer. */
it("resolves only once every queued write has finished", async () => {
  const queue = createNoteQueue();
  const pending = deferred();
  const done = vi.fn();

  queue.push(async () => {
    await pending.promise;
    done();
  });

  const settled = queue.settle();
  expect(done).not.toHaveBeenCalled();

  pending.resolve();
  await settled;

  expect(done).toHaveBeenCalledTimes(1);
});

/** A lone failure must not surface as an unhandled rejection. */
it("settles a failed write that nothing follows or awaits", async () => {
  const unhandled = vi.fn();
  process.on("unhandledRejection", unhandled);

  const queue = createNoteQueue();
  queue.push(() => Promise.reject(new Error("refused")));

  await new Promise((resolve) => setTimeout(resolve, 0));
  await new Promise((resolve) => setTimeout(resolve, 0));

  process.off("unhandledRejection", unhandled);

  expect(unhandled).not.toHaveBeenCalled();
});
