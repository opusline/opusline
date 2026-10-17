import type {
  EmailPreviewData,
  EmailTemplateData,
  EmailTemplateKind,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { Field, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { Panel, PanelTitle } from "@opusline/ui/components/panel";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { Textarea } from "@opusline/ui/components/textarea";
import { cn } from "@opusline/ui/lib/utils";
import { CircleAlert } from "lucide-react";
import { useId, useRef } from "react";

import { SaveBar } from "@/components/save-bar";
import { m } from "@/paraglide/messages.js";
import {
  EMAIL_KIND_TOKENS,
  EMAIL_TEMPLATE_KINDS,
  type EmailTemplateDraft,
  emailKindDetail,
  emailKindLabel,
  insertToken,
} from "../lib/email-templates";

const LABEL = "text-muted-foreground-2 text-xs";

type EmailTemplatesPageProps = {
  templates: EmailTemplateData[];
  selected: EmailTemplateKind;
  onSelect: (kind: EmailTemplateKind) => void;
  /** What the fields show; the stored wording until the account types. */
  draft: EmailTemplateDraft;
  onDraftChange: (draft: EmailTemplateDraft) => void;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
  /** The e-mail rendered from the draft with sample figures; null while it loads. */
  preview: EmailPreviewData | null;
  isPreviewFailed: boolean;
  /** False on an instance with no mailer, where a test send has nowhere to go. */
  mailEnabled: boolean;
  isSendingTest: boolean;
  onSendTest: () => void;
  error: string | null;
};

/** The design's « E-mails » page: the templates on the left, the editor and its live preview on the right. */
export function EmailTemplatesPage({
  templates,
  selected,
  onSelect,
  draft,
  onDraftChange,
  isDirty,
  isSaving,
  onSave,
  onCancel,
  onReset,
  preview,
  isPreviewFailed,
  mailEnabled,
  isSendingTest,
  onSendTest,
  error,
}: EmailTemplatesPageProps) {
  const ids = { subject: useId(), body: useId() };
  const bodyField = useRef<HTMLTextAreaElement>(null);
  const current = templates.find((template) => template.kind === selected);

  const insert = (token: string) => {
    const field = bodyField.current;
    const next = insertToken(
      draft.body,
      token,
      field?.selectionStart ?? null,
      field?.selectionEnd ?? null,
    );

    onDraftChange({ ...draft, body: next.text });
    // The caret lands after the token, where typing continues.
    requestAnimationFrame(() => {
      field?.focus();
      field?.setSelectionRange(next.caret, next.caret);
    });
  };

  return (
    <div className="max-w-330 pb-24">
      <div className="mb-5">
        <h1
          className="mb-1 font-heading font-semibold text-2xl text-foreground-hi"
          data-testid="page-heading"
        >
          {m.emails_title()}
        </h1>
        <p className="max-w-[66ch] text-muted-foreground-3 text-sm text-pretty">
          {m.emails_subtitle()}
        </p>
      </div>

      {error === null ? null : (
        <Alert className="mb-4" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap items-start gap-5">
        <nav
          aria-label={m.emails_title()}
          className="flex min-w-55 flex-[0_1_15.625rem] flex-col gap-2"
        >
          {EMAIL_TEMPLATE_KINDS.map((kind) => {
            const template = templates.find((row) => row.kind === kind);
            const isSelected = kind === selected;

            return (
              <button
                aria-pressed={isSelected}
                className={cn(
                  "w-full rounded-md border px-3.5 py-3 text-left transition-colors",
                  isSelected
                    ? "border-primary/50 bg-primary/8"
                    : "border-border bg-card hover:bg-accent",
                )}
                data-kind={EMAIL_KIND_TOKENS[kind]}
                data-modified={template?.isCustom === true}
                data-testid="emails-kind"
                key={kind}
                onClick={() => onSelect(kind)}
                type="button"
              >
                <span className="flex items-center gap-2 text-foreground-hi text-sm">
                  {emailKindLabel(kind)}
                  {template?.isCustom === true ? (
                    <Badge variant="quiet">{m.emails_modified()}</Badge>
                  ) : null}
                </span>
                <span className="mt-0.75 block text-muted-foreground-3 text-xs">
                  {emailKindDetail(kind)}
                </span>
              </button>
            );
          })}
        </nav>

        <Panel
          className="flex min-w-0 flex-[1_1_23.75rem] flex-col gap-3.5 px-5 py-5"
          data-testid="emails-editor"
          padding="none"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <PanelTitle>{emailKindLabel(selected)}</PanelTitle>
            {current?.isCustom === true ? (
              <Button
                data-testid="emails-reset"
                disabled={isSaving}
                onClick={onReset}
                size="sm"
                variant="link"
              >
                {m.emails_reset()}
              </Button>
            ) : null}
          </div>
          <Field>
            <FieldLabel className={LABEL} htmlFor={ids.subject}>
              {m.emails_subject_label()}
            </FieldLabel>
            <Input
              data-testid="emails-subject"
              id={ids.subject}
              onChange={(event) =>
                onDraftChange({ ...draft, subject: event.target.value })
              }
              value={draft.subject}
            />
          </Field>
          <Field>
            <FieldLabel className={LABEL} htmlFor={ids.body}>
              {m.emails_body_label()}
            </FieldLabel>
            <Textarea
              className="min-h-72 leading-relaxed"
              data-testid="emails-body"
              id={ids.body}
              onChange={(event) =>
                onDraftChange({ ...draft, body: event.target.value })
              }
              ref={bodyField}
              rows={12}
              value={draft.body}
            />
          </Field>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-0.5 text-muted-foreground-3 text-xs">
              {m.emails_insert_label()}
            </span>
            {(current?.variables ?? []).map((name) => (
              <button
                className="h-6.5 rounded-md border border-border-2 bg-muted px-2 font-mono text-foreground-3 text-xs transition-colors hover:border-primary hover:text-primary-text"
                data-name={name}
                data-testid="emails-variable"
                key={name}
                onClick={() => insert(name)}
                type="button"
              >
                {`{${name}}`}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3.5">
            <span className="text-muted-foreground-3 text-xs">
              {mailEnabled ? "" : m.emails_test_unavailable()}
            </span>
            {mailEnabled ? (
              <Button
                data-testid="emails-send-test"
                disabled={isSendingTest || isDirty}
                onClick={onSendTest}
                size="sm"
                variant="link"
              >
                {m.emails_send_test()}
              </Button>
            ) : null}
          </div>
        </Panel>

        <div className="flex min-w-0 flex-[1_1_27.5rem] flex-col gap-2.5">
          <span className="text-muted-foreground-3 text-xs">
            {m.emails_preview_label()}
          </span>
          {isPreviewFailed ? (
            <Alert data-testid="emails-preview-failed" variant="warn">
              <CircleAlert />
              <AlertDescription>{m.emails_preview_failed()}</AlertDescription>
            </Alert>
          ) : preview === null ? (
            <Skeleton className="h-190 w-full" />
          ) : (
            <>
              <div
                className="rounded-md border bg-card px-4 py-3 text-sm"
                data-testid="emails-preview-subject"
              >
                <span className="text-muted-foreground-3">
                  {m.emails_subject_label()}
                </span>{" "}
                <span className="font-medium text-foreground-hi">
                  {preview.subject}
                </span>
              </div>
              <iframe
                className="h-190 w-full rounded-md border bg-white"
                data-testid="emails-preview"
                sandbox=""
                srcDoc={preview.html}
                title={m.emails_preview_label()}
              />
            </>
          )}
        </div>
      </div>

      {isDirty ? (
        <div className="sticky bottom-4 z-10 mt-4">
          <SaveBar
            isSaving={isSaving}
            label={m.emails_unsaved()}
            onCancel={onCancel}
          >
            <Button
              data-testid="emails-save"
              disabled={
                isSaving ||
                draft.subject.trim() === "" ||
                draft.body.trim() === ""
              }
              onClick={onSave}
              size="xl"
            >
              {m.common_save()}
            </Button>
          </SaveBar>
        </div>
      ) : null}
    </div>
  );
}
