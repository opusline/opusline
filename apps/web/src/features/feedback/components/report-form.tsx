import type {
  RelayedIssueData,
  ReportData,
  ReportKind,
} from "@opusline/api-client";
import { zReportData } from "@opusline/api-client/zod";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Checkbox } from "@opusline/ui/components/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { Label } from "@opusline/ui/components/label";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
import { linkVariants } from "@opusline/ui/components/text-link";
import { Textarea } from "@opusline/ui/components/textarea";
import { useForm } from "@tanstack/react-form";
import { CircleAlert, CircleCheck } from "lucide-react";
import { useId } from "react";
import * as z from "zod/mini";

import type { FieldErrorMap } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export type ReportContext = NonNullable<ReportData["context"]>;

const REPORT_KINDS: ReportKind[] = [0, 1];

const KIND_LABELS: Record<ReportKind, () => string> = {
  0: m.report_kind_bug,
  1: m.report_kind_feature,
};

const BODY_LABELS: Record<ReportKind, () => string> = {
  0: m.report_body_label_bug,
  1: m.report_body_label_feature,
};

const reportSchema = z.extend(
  z.pick(zReportData, { kind: true, title: true, body: true }),
  { shareContext: z.boolean() },
);

type ReportFormProps = {
  /** What would be attached: shown in full, so the account knows what leaves. */
  context: ReportContext;
  onSubmit: (
    report: ReportData,
  ) => Promise<FieldErrorMap | null | undefined> | undefined;
  isPending?: boolean;
  error?: string | null;
  filedIssue?: RelayedIssueData | null;
  onSendAnother?: () => void;
};

export function ReportForm({
  context,
  onSubmit,
  isPending,
  error,
  filedIssue,
  onSendAnother,
}: ReportFormProps) {
  const shareContextId = useId();
  const form = useForm({
    defaultValues: {
      kind: 0 as ReportKind,
      title: "",
      body: "",
      shareContext: true,
    },
    validators: {
      onSubmit: reportSchema,
      onSubmitAsync: async ({ value }) => {
        const fieldErrors = await onSubmit({
          kind: value.kind,
          title: value.title,
          body: value.body,
          context: value.shareContext ? context : null,
        });
        return fieldErrors ? { fields: fieldErrors } : null;
      },
    },
  });

  if (filedIssue) {
    return (
      <div className="flex flex-col gap-3" data-testid="report-sent">
        <Alert variant="success">
          <CircleCheck />
          <AlertDescription>
            {m.report_sent({ number: filedIssue.number })}{" "}
            <a
              className={linkVariants({ underline: "always" })}
              data-testid="report-issue-link"
              href={filedIssue.url}
              rel="noreferrer"
              target="_blank"
            >
              {m.report_sent_link()}
            </a>
          </AlertDescription>
        </Alert>
        <Button
          data-testid="report-send-another"
          onClick={onSendAnother}
          type="button"
          variant="outline"
        >
          {m.report_send_another()}
        </Button>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      {error ? (
        <Alert variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <form.Field name="kind">
        {(field) => (
          <SegmentedControl
            aria-label={m.report_kind_label()}
            data-testid="report-kind"
            onValueChange={(value) => {
              const next = value[0];

              if (typeof next === "string") {
                field.handleChange(Number(next) as ReportKind);
              }
            }}
            value={[String(field.state.value)]}
          >
            {REPORT_KINDS.map((kind) => (
              <SegmentedControlItem
                data-kind={kind}
                data-testid="report-kind-item"
                key={kind}
                value={String(kind)}
              >
                {KIND_LABELS[kind]()}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        )}
      </form.Field>
      <form.Field name="title">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor="report-title">
                {m.report_title_label()}
              </FieldLabel>
              <Input
                aria-invalid={isInvalid}
                data-testid="report-title"
                id="report-title"
                maxLength={120}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                value={field.state.value}
              />
              {isInvalid ? (
                <FieldError errors={field.state.meta.errors} />
              ) : null}
            </Field>
          );
        }}
      </form.Field>
      <form.Subscribe selector={(state) => state.values.kind}>
        {(kind) => (
          <form.Field name="body">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor="report-body">
                    {BODY_LABELS[kind]()}
                  </FieldLabel>
                  <Textarea
                    aria-invalid={isInvalid}
                    data-testid="report-body"
                    id="report-body"
                    maxLength={6000}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    rows={5}
                    value={field.state.value}
                  />
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              );
            }}
          </form.Field>
        )}
      </form.Subscribe>
      <form.Field name="shareContext">
        {(field) => (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={field.state.value}
                data-testid="report-share-context"
                id={shareContextId}
                onCheckedChange={(checked) => field.handleChange(checked)}
              />
              <Label htmlFor={shareContextId} tone="quiet">
                {m.report_share_context()}
              </Label>
            </div>
            {field.state.value ? <ContextDetails context={context} /> : null}
          </div>
        )}
      </form.Field>
      <FieldDescription>{m.report_public_notice()}</FieldDescription>
      <Button data-testid="report-submit" disabled={isPending} type="submit">
        {m.report_submit()}
      </Button>
    </form>
  );
}

function ContextDetails({ context }: { context: ReportContext }) {
  const rows: [label: string, value: string][] = [
    [m.report_context_route(), context.route],
    [m.report_context_browser(), context.browser],
    [m.report_context_locale(), context.locale],
  ];

  return (
    <details className="text-muted-foreground-3 text-xs">
      <summary className="cursor-pointer">{m.report_context_details()}</summary>
      <dl
        className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1"
        data-testid="report-context"
      >
        {rows.map(([label, value]) => (
          <div className="contents" key={label}>
            <dt>{label}</dt>
            <dd className="break-all font-mono text-foreground-3">{value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
