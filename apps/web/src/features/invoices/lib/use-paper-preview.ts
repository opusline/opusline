import type { InvoicePaperData } from "@opusline/api-client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDeferredValue } from "react";

import { useSettled } from "@/lib/use-settled";

/**
 * The sheet an unsaved document would print, fetched once typing settles and
 * kept on screen while the next one loads. No sheet while the body is null:
 * the document cannot be priced yet.
 */
export function usePaperPreview<Body>(
  key: readonly unknown[],
  body: Body | null,
  fetchPaper: (body: Body) => Promise<InvoicePaperData>,
) {
  const deferred = useDeferredValue(body);
  const settled = useSettled(JSON.stringify(deferred));
  const preview = useQuery({
    queryKey: [...key, settled],
    queryFn: () => fetchPaper(JSON.parse(settled) as Body),
    enabled: deferred !== null,
    placeholderData: keepPreviousData,
    retry: false,
  });

  return {
    paper: deferred === null ? null : (preview.data ?? null),
    error: preview.isError ? preview.error : null,
  };
}
