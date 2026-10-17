import type {
  EmailTemplateData,
  EmailTemplateKind,
  EmailTemplatesData,
  ReminderDefaultsData,
} from "@opusline/api-client";
import { previewEmailTemplate } from "@opusline/api-client";
import {
  getPingOptions,
  listEmailTemplatesOptions,
  listEmailTemplatesQueryKey,
  resetEmailTemplateMutation,
  testEmailTemplateMutation,
  updateEmailTemplateMutation,
  updateReminderDefaultsMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useToast } from "@opusline/ui/components/toast";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";

import { EmailTemplatesPage } from "@/features/invoices/components/email-templates-page";
import type { EmailTemplateDraft } from "@/features/invoices/lib/email-templates";
import { requireInvoicing } from "@/lib/features";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/invoicing/emails")({
  beforeLoad: ({ context }) => requireInvoicing(context.user),
  component: EmailTemplatesRoute,
});

/** The preview is a round trip to the API: typed text waits a beat before it goes. */
const PREVIEW_DELAY_MS = 400;

function useSettled<T>(value: T, delayMs: number): T {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delayMs);

    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return settled;
}

function draftOf(template: EmailTemplateData): EmailTemplateDraft {
  return { subject: template.subject, body: template.body };
}

function EmailTemplatesRoute() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const templates = useQuery(listEmailTemplatesOptions());
  // Whether the instance has a mailer is guest-readable config, as on the login screen.
  const ping = useQuery(getPingOptions());
  const [selected, setSelected] = useState<EmailTemplateKind>(0);
  const [edited, setEdited] = useState<EmailTemplateDraft | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stored = templates.data?.templates.find(
    (template) => template.kind === selected,
  );
  const draft = edited ?? (stored === undefined ? null : draftOf(stored));
  const settledDraft = useSettled(draft, PREVIEW_DELAY_MS);
  const previewKey = JSON.stringify([selected, settledDraft]);
  const preview = useQuery({
    queryKey: ["email-template-preview", previewKey],
    queryFn: async () => {
      const { data } = await previewEmailTemplate({
        path: { kind: selected },
        body: settledDraft ?? {},
        throwOnError: true,
      });

      return data;
    },
    enabled: settledDraft !== null,
    placeholderData: keepPreviousData,
  });

  const replaceInList = (saved: EmailTemplateData) =>
    queryClient.setQueryData<EmailTemplatesData>(
      listEmailTemplatesQueryKey(),
      (current) =>
        current && {
          ...current,
          templates: current.templates.map((template) =>
            template.kind === saved.kind ? saved : template,
          ),
        },
    );

  const save = useMutation({
    ...updateEmailTemplateMutation(),
    onMutate: () => setError(null),
    onSuccess: (saved) => {
      replaceInList(saved);
      setEdited(null);
      toast.add({ title: m.emails_saved() });
    },
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.emails_save_failed())),
  });
  const reset = useMutation({
    ...resetEmailTemplateMutation(),
    onMutate: () => setError(null),
    onSuccess: (restored) => {
      replaceInList(restored);
      setEdited(null);
    },
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.emails_reset_failed())),
  });
  const saveReminderDefaults = useMutation({
    ...updateReminderDefaultsMutation(),
    onMutate: () => setError(null),
    onSuccess: (saved: ReminderDefaultsData) =>
      queryClient.setQueryData<EmailTemplatesData>(
        listEmailTemplatesQueryKey(),
        (current) => current && { ...current, reminderDefaults: saved },
      ),
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.emails_reminders_save_failed())),
  });
  const sendTest = useMutation({
    ...testEmailTemplateMutation(),
    onMutate: () => setError(null),
    onSuccess: () => toast.add({ title: m.emails_test_sent() }),
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.emails_test_failed())),
  });

  if (templates.isPending) {
    return <Skeleton className="h-150 w-full" />;
  }

  if (templates.isError || draft === null || stored === undefined) {
    return (
      <Alert className="max-w-200" variant="warn">
        <CircleAlert />
        <AlertDescription>{m.emails_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  const path = { path: { kind: selected } };

  return (
    <EmailTemplatesPage
      draft={draft}
      error={error}
      isDirty={edited !== null}
      isPreviewFailed={preview.isError}
      isSaving={save.isPending || reset.isPending}
      isSendingTest={sendTest.isPending}
      mailEnabled={ping.data?.mailEnabled !== false}
      onCancel={() => setEdited(null)}
      onDraftChange={setEdited}
      onReset={() => reset.mutate(path)}
      onSave={() =>
        save.mutate({
          ...path,
          body: { subject: draft.subject.trim(), body: draft.body.trim() },
        })
      }
      onSelect={(kind) => {
        setSelected(kind);
        setEdited(null);
      }}
      onReminderDefaultsChange={(defaults) =>
        saveReminderDefaults.mutate({ body: defaults })
      }
      onSendTest={() => sendTest.mutate(path)}
      preview={preview.data ?? null}
      reminderDefaults={
        saveReminderDefaults.variables?.body ?? templates.data.reminderDefaults
      }
      selected={selected}
      templates={templates.data.templates}
    />
  );
}
