import type { DocumentData } from "@opusline/api-client";
import { listUserDocumentsQueryKey } from "@opusline/api-client/react-query";
import { QueryClient } from "@tanstack/react-query";
import { expect, it } from "vitest";

import { documentHandlers, dropDocumentFromCache } from "./documents";

function document(id: number): DocumentData {
  return {
    id,
    fileName: `contrat-${id}.pdf`,
    category: 0,
    source: 0,
    sizeBytes: 1024,
    createdAt: "2026-09-01T10:00:00+00:00",
  };
}

function seededClient() {
  const queryClient = new QueryClient();
  queryClient.setQueryData(listUserDocumentsQueryKey(), {
    documents: [document(1), document(2)],
  });

  return queryClient;
}

it("takes the row off the list before the delete lands", () => {
  const queryClient = seededClient();

  dropDocumentFromCache(queryClient, listUserDocumentsQueryKey())(document(1));

  expect(
    queryClient
      .getQueryData<{ documents: DocumentData[] }>(listUserDocumentsQueryKey())
      ?.documents.map((row) => row.id),
  ).toEqual([2]);
});

it("puts it back when the delete is refused", async () => {
  const queryClient = seededClient();
  const { handleDelete } = documentHandlers({
    upload: () => Promise.resolve(),
    remove: () => Promise.reject(new Error("nope")),
    invalidate: () => Promise.resolve(),
    dropFromCache: dropDocumentFromCache(
      queryClient,
      listUserDocumentsQueryKey(),
    ),
  });

  await expect(handleDelete(document(1))).resolves.toBe(false);
  expect(
    queryClient
      .getQueryData<{ documents: DocumentData[] }>(listUserDocumentsQueryKey())
      ?.documents.map((row) => row.id),
  ).toEqual([1, 2]);
});

it("leaves a list nobody has loaded alone", () => {
  const queryClient = new QueryClient();

  expect(() =>
    dropDocumentFromCache(
      queryClient,
      listUserDocumentsQueryKey(),
    )(document(1))(),
  ).not.toThrow();
});
