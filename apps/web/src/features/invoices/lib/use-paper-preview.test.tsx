import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { invoicePaperFixture } from "./invoice-paper-fixture";
import { usePaperPreview } from "./use-paper-preview";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );
}

it("never asks for a sheet before the body it would send has settled", async () => {
  const fetchPaper = vi.fn(async () => invoicePaperFixture);
  const { rerender } = renderHook(
    ({ body }: { body: { clientId: number } | null }) =>
      usePaperPreview(["test-preview"], body, fetchPaper),
    { initialProps: { body: null }, wrapper },
  );

  rerender({ body: { clientId: 7 } });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(100);
  });
  expect(fetchPaper).not.toHaveBeenCalled();

  await act(async () => {
    await vi.advanceTimersByTimeAsync(500);
  });
  expect(fetchPaper).toHaveBeenCalledTimes(1);
  expect(fetchPaper).toHaveBeenCalledWith({ clientId: 7 });
});
