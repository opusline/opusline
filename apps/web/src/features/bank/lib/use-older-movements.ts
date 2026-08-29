import type { BankAccountData, BankMovementData } from "@opusline/api-client";
import { listBankMovementsInfiniteOptions } from "@opusline/api-client/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

export type OlderMovements = {
  /** Pages fetched past the summary's window, oldest last. */
  movements: BankMovementData[];
  hasMore: boolean;
  isLoading: boolean;
  onShowMore: () => void;
};

/**
 * The movement pages past the summary's window, pulled on demand. Keyed on
 * the summary's own cursor, so a write that refreshes the summary drops the
 * stale pages instead of splicing them onto new rows; bank-account.tsx also
 * invalidates the pages on every write, because a balance edit moves the
 * running balances without moving the cursor.
 */
export function useOlderMovements(
  summary: BankAccountData | undefined,
): OlderMovements {
  const firstOlderCursor = summary?.nextMovementsCursor ?? null;
  const [expanded, setExpanded] = useState(false);

  const pages = useInfiniteQuery({
    ...listBankMovementsInfiniteOptions({
      query: { cursor: firstOlderCursor ?? undefined },
    }),
    enabled: expanded && firstOlderCursor !== null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: firstOlderCursor,
  });

  const onShowMore = () => {
    if (!expanded) {
      setExpanded(true);

      return;
    }

    if (pages.isError) {
      void pages.refetch();

      return;
    }

    void pages.fetchNextPage();
  };

  return {
    movements: pages.data?.pages.flatMap((page) => page.movements) ?? [],
    // A failed page keeps the button on screen: it is the only path to the
    // older rows, so it doubles as the retry.
    hasMore:
      firstOlderCursor !== null && (!pages.isSuccess || pages.hasNextPage),
    isLoading: pages.isFetching,
    onShowMore,
  };
}
