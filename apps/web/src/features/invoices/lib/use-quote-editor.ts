import {
  createQuoteDraft,
  issueQuote,
  previewQuotePaper,
  type SaveQuoteDraftData,
  type UserData,
  updateQuoteDraft,
} from "@opusline/api-client";
import {
  listCatalogItemsOptions,
  listClientsOptions,
  showInvoicingSettingsOptions,
  showInvoicingSettingsQueryKey,
  showQuoteOptions,
  showSettingsOptions,
} from "@opusline/api-client/react-query";
import { useToast } from "@opusline/ui/components/toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { accountTodayCalendarDate } from "@/lib/dates";
import { companyLogoHref } from "@/lib/logos";
import { invalidateQuoteWrites } from "@/lib/query-invalidation";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";
import type { InvoiceEditorPageProps } from "../components/invoice-editor-page";
import { type InvoiceDraft, newInvoiceDraft } from "./invoice-draft";
import {
  duplicateQuoteDraft,
  quoteDraftFromDetail,
  quoteDraftPayload,
} from "./quote-draft";
import { usePaperPreview } from "./use-paper-preview";

type QuoteEditor =
  | { status: "pending" }
  | { status: "error" }
  | { status: "ready"; page: InvoiceEditorPageProps };

/**
 * Everything the quote editor reads and writes, for a new quote (null) or a
 * saved draft. The invoice editor's twin, minus the tracked time: a quote
 * bills nothing yet.
 */
export function useQuoteEditor(
  user: UserData,
  quoteId: number | null,
  /** A new quote may start as a copy of another one. */
  duplicateOf: number | null = null,
): QuoteEditor {
  const format = useMoneyFormat();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const clients = useQuery(listClientsOptions());
  const catalog = useQuery(listCatalogItemsOptions());
  const settings = useQuery(showInvoicingSettingsOptions());
  const identity = useQuery(showSettingsOptions());
  const sourceId = quoteId ?? duplicateOf;
  const saved = useQuery({
    ...showQuoteOptions({ path: { quote: sourceId ?? 0 } }),
    enabled: sourceId !== null,
  });
  const [edited, setEdited] = useState<InvoiceDraft | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const seed = useMemo(() => {
    if (settings.data === undefined) {
      return null;
    }

    if (sourceId === null) {
      return newInvoiceDraft(format.locale, settings.data);
    }

    if (saved.data === undefined) {
      return null;
    }

    return quoteId === null
      ? duplicateQuoteDraft(format, saved.data)
      : quoteDraftFromDetail(format, saved.data);
  }, [format, quoteId, sourceId, settings.data, saved.data]);
  const draft = edited ?? seed;
  const preview = usePaperPreview(
    ["quote-editor-preview"],
    draft === null ? null : quoteDraftPayload(format, draft),
    async (body: SaveQuoteDraftData) => {
      const { data } = await previewQuotePaper({ body, throwOnError: true });

      return data;
    },
  );

  // The page only hands over a draft with a client and complete lines.
  const bodyOf = (complete: InvoiceDraft): SaveQuoteDraftData =>
    quoteDraftPayload(format, complete) ?? ({} as SaveQuoteDraftData);

  const store = async (body: SaveQuoteDraftData): Promise<number> => {
    if (quoteId === null) {
      const { data } = await createQuoteDraft({ body, throwOnError: true });

      return data.quote.id;
    }

    await updateQuoteDraft({
      body,
      path: { quote: quoteId },
      throwOnError: true,
    });

    return quoteId;
  };

  const openSaved = async (id: number) => {
    if (quoteId === null) {
      await navigate({
        to: "/invoicing/quotes/$quoteId/edit",
        params: { quoteId: String(id) },
        replace: true,
      });
    }
  };

  const refresh = () => invalidateQuoteWrites(queryClient);

  const run = async (write: () => Promise<void>) => {
    setIsSaving(true);
    try {
      await write();
      setError(null);
    } catch (failure) {
      setError(serverErrorMessage(failure, m.common_save_failed()));
    } finally {
      setIsSaving(false);
    }
  };

  if (
    clients.isError ||
    catalog.isError ||
    settings.isError ||
    identity.isError ||
    saved.isError ||
    (sourceId !== null && saved.data !== undefined && seed === null)
  ) {
    return { status: "error" };
  }

  if (
    draft === null ||
    clients.data === undefined ||
    catalog.data === undefined ||
    settings.data === undefined ||
    identity.data === undefined
  ) {
    return { status: "pending" };
  }

  return {
    status: "ready",
    page: {
      kind: "quote",
      invoiceId: quoteId,
      draft,
      onChange: setEdited,
      clients: clients.data.clients,
      catalog: catalog.data.items,
      settings: settings.data,
      seller: {
        iban: identity.data.iban,
        email: identity.data.contactEmail ?? user.email,
      },
      defaultVatRateBp: settings.data.vatLiable ? user.effectiveVatRateBp : 0,
      today: accountTodayCalendarDate(user.timezone),
      logoSrc: identity.data.hasLogo ? companyLogoHref() : undefined,
      paper: preview.paper,
      unbilledTime: null,
      isSaving,
      error,
      onSave: (complete) =>
        void run(async () => {
          const id = await store(bodyOf(complete));
          await refresh();
          toast.add({ title: m.editor_draft_saved() });
          await openSaved(id);
        }),
      onValidate: (complete) =>
        void run(async () => {
          const id = await store(bodyOf(complete));
          const { data } = await issueQuote({
            path: { quote: id },
            throwOnError: true,
          }).finally(refresh);

          await queryClient.invalidateQueries({
            queryKey: showInvoicingSettingsQueryKey(),
          });
          toast.add({
            title: m.editor_quote_issued({ number: data.quote.number ?? "" }),
          });
          await navigate({
            to: "/invoicing/quotes/$quoteId",
            params: { quoteId: String(id) },
          });
        }),
    },
  };
}
