import {
  createInvoiceDraft,
  issueInvoice,
  previewInvoicePaper,
  type SaveInvoiceDraftData,
  type UserData,
  updateInvoiceDraft,
} from "@opusline/api-client";
import {
  listCatalogItemsOptions,
  listClientsOptions,
  showInvoiceOptions,
  showInvoicingSettingsOptions,
  showInvoicingSettingsQueryKey,
  showSettingsOptions,
  showUnbilledTimeOptions,
} from "@opusline/api-client/react-query";
import { useToast } from "@opusline/ui/components/toast";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { accountTodayCalendarDate } from "@/lib/dates";
import { companyLogoHref } from "@/lib/logos";
import {
  invalidateInvoiceWrites,
  operationFilter,
} from "@/lib/query-invalidation";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

import type { InvoiceEditorPageProps } from "../components/invoice-editor-page";
import {
  draftFromDetail,
  draftPayload,
  duplicateDraft,
  type InvoiceDraft,
  newInvoiceDraft,
} from "./invoice-draft";

const PREVIEW_DELAY_MS = 400;

type InvoiceEditor =
  | { status: "pending" }
  | { status: "error" }
  | { status: "ready"; page: InvoiceEditorPageProps };

/** Waits for typing to settle, so the preview is not re-rendered on every key. */
function useSettled<T>(value: T): T {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), PREVIEW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [value]);

  return settled;
}

/**
 * Everything the invoice editor reads and writes, for a new invoice (null) or
 * a saved draft. The draft lives here rather than in the page so the preview
 * and the unbilled-time lookup can follow it.
 */
export function useInvoiceEditor(
  user: UserData,
  invoiceId: number | null,
  /** A new invoice may start as a copy of another one. */
  duplicateOf: number | null = null,
): InvoiceEditor {
  const format = useMoneyFormat();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const clients = useQuery(listClientsOptions());
  const catalog = useQuery(listCatalogItemsOptions());
  const settings = useQuery(showInvoicingSettingsOptions());
  const identity = useQuery(showSettingsOptions());
  const sourceId = invoiceId ?? duplicateOf;
  const saved = useQuery({
    ...showInvoiceOptions({ path: { invoice: sourceId ?? 0 } }),
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

    if (invoiceId === null) {
      return duplicateDraft(format, saved.data);
    }

    // An issued invoice is part of the record: only a draft reopens here.
    return saved.data.invoice.status === 0
      ? draftFromDetail(format, saved.data)
      : null;
  }, [format, invoiceId, sourceId, settings.data, saved.data]);
  const draft = edited ?? seed;
  const payload = useDeferredValue(
    draft === null ? null : draftPayload(format, draft),
  );
  const previewBody = useSettled(JSON.stringify(payload));

  const preview = useQuery({
    queryKey: ["invoice-editor-preview", previewBody],
    queryFn: async () => {
      const { data } = await previewInvoicePaper({
        body: JSON.parse(previewBody) as SaveInvoiceDraftData,
        throwOnError: true,
      });

      return data;
    },
    enabled: payload !== null,
    placeholderData: keepPreviousData,
  });

  const missionId = draft?.missionId ?? null;
  const unbilled = useQuery({
    ...showUnbilledTimeOptions({
      query: { missionId: missionId ?? 0, invoiceId },
    }),
    enabled: missionId !== null,
  });

  const store = async (body: SaveInvoiceDraftData): Promise<number> => {
    if (invoiceId === null) {
      const { data } = await createInvoiceDraft({ body, throwOnError: true });

      return data.invoice.id;
    }

    await updateInvoiceDraft({
      body,
      path: { invoice: invoiceId },
      throwOnError: true,
    });

    return invoiceId;
  };

  // A new invoice moves to its edit URL once saved, so « Nouveau → Facture »
  // always opens an empty editor instead of writing over the draft just saved.
  const openSaved = async (id: number) => {
    if (invoiceId === null) {
      await navigate({
        to: "/invoicing/invoices/$invoiceId/edit",
        params: { invoiceId: String(id) },
        replace: true,
      });
    }
  };

  const refresh = async () => {
    await invalidateInvoiceWrites(queryClient);
    await queryClient.invalidateQueries(operationFilter("showUnbilledTime"));
  };

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
      invoiceId,
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
      paper: payload === null ? null : (preview.data ?? null),
      unbilledTime: missionId === null ? null : (unbilled.data ?? null),
      isSaving,
      error,
      onSave: (body) =>
        void run(async () => {
          const id = await store(body);
          await refresh();
          toast.add({ title: m.editor_draft_saved() });
          await openSaved(id);
        }),
      onValidate: (body) =>
        void run(async () => {
          const id = await store(body);
          // A refused validation (missing SIRET, client address…) still
          // leaves the draft saved, so the list shows it.
          const { data } = await issueInvoice({
            path: { invoice: id },
            throwOnError: true,
          }).finally(refresh);

          await queryClient.invalidateQueries({
            queryKey: showInvoicingSettingsQueryKey(),
          });
          toast.add({
            title: m.editor_issued({ number: data.invoice.number ?? "" }),
          });
          await navigate({
            to: "/invoicing/invoices/$invoiceId",
            params: { invoiceId: String(id) },
          });
        }),
    },
  };
}
