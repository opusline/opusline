import type {
  EnableBankingSettingsData,
  SaveEnableBankingCredentialsData,
} from "@opusline/api-client";
import { zSaveEnableBankingCredentialsData } from "@opusline/api-client/zod";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@opusline/ui/components/alert-dialog";
import { Button } from "@opusline/ui/components/button";
import { CopyButton } from "@opusline/ui/components/copy-button";
import { FieldError } from "@opusline/ui/components/field";
import {
  StatusRow,
  StatusRowActions,
  StatusRowContent,
  StatusRowDescription,
  StatusRowMedia,
  StatusRowTitle,
} from "@opusline/ui/components/status-row";
import { linkVariants, TextLink } from "@opusline/ui/components/text-link";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import {
  CircleAlert,
  CircleCheck,
  ExternalLink,
  FileKey,
  KeyRound,
} from "lucide-react";
import { useRef, useState } from "react";

import { FormTextField } from "@/components/form-text-field";
import type { FormSubmitResult } from "@/lib/form";
import { m } from "@/paraglide/messages.js";
import { SettingsSection } from "./settings-section";

const SETUP_GUIDE =
  "https://github.com/opusline/opusline/blob/main/docs/bank-sync.md";

type EnableBankingCardProps = {
  settings: EnableBankingSettingsData;
  isRemoving: boolean;
  error: string | null;
  onSave: (
    values: SaveEnableBankingCredentialsData,
  ) => Promise<FormSubmitResult>;
  onRemove: () => void;
};

/**
 * The account's own Enable Banking application: how to create one, and the
 * two values Opusline needs from it. The private key is write-only — once
 * saved, the card only ever shows the application id.
 */
export function EnableBankingCard({
  settings,
  isRemoving,
  error,
  onSave,
  onRemove,
}: EnableBankingCardProps) {
  const [isReplacing, setIsReplacing] = useState(false);
  const [hasJustSaved, setHasJustSaved] = useState(false);
  const { applicationId } = settings;

  return (
    <SettingsSection
      description={m.integrations_enable_banking_description()}
      title={m.integrations_enable_banking_title()}
    >
      <div
        className="flex flex-col gap-5"
        data-status={applicationId === null ? "unconfigured" : "configured"}
        data-testid="enable-banking-card"
      >
        {error === null ? null : (
          <Alert variant="warn">
            <CircleAlert />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {hasJustSaved && applicationId !== null ? (
          <Alert variant="success">
            <CircleCheck />
            <AlertDescription>
              <Link
                className={linkVariants({ underline: "always" })}
                to="/bank-account"
              >
                {m.integrations_enable_banking_saved()}
              </Link>
            </AlertDescription>
          </Alert>
        ) : null}

        <SetupSteps redirectUrl={settings.redirectUrl} />

        {applicationId === null || isReplacing ? (
          <CredentialsForm
            onCancel={
              applicationId === null ? null : () => setIsReplacing(false)
            }
            onSave={async (values) => {
              setHasJustSaved(false);
              const result = await onSave(values);

              if (result.status === "success") {
                setIsReplacing(false);
                setHasJustSaved(true);
              }

              return result;
            }}
          />
        ) : (
          <StatusRow>
            <StatusRowMedia>
              <KeyRound aria-hidden />
            </StatusRowMedia>
            <StatusRowContent>
              <StatusRowTitle>
                {m.integrations_enable_banking_saved_title()}
              </StatusRowTitle>
              <StatusRowDescription className="font-mono">
                {m.integrations_enable_banking_saved_detail({
                  id: applicationId,
                })}
              </StatusRowDescription>
            </StatusRowContent>
            <StatusRowActions>
              <Button
                data-testid="enable-banking-replace"
                onClick={() => setIsReplacing(true)}
                size="lg"
                variant="secondary"
              >
                {m.integrations_enable_banking_replace()}
              </Button>
              <RemoveButton isRemoving={isRemoving} onRemove={onRemove} />
            </StatusRowActions>
          </StatusRow>
        )}

        <TextLink
          className="inline-flex items-center gap-1.5 self-start"
          href={SETUP_GUIDE}
          rel="noreferrer"
          size="sm"
          target="_blank"
          underline="hover"
        >
          {m.integrations_enable_banking_docs()}
          <ExternalLink aria-hidden className="size-3.5" />
        </TextLink>
      </div>
    </SettingsSection>
  );
}

function SetupSteps({ redirectUrl }: { redirectUrl: string }) {
  return (
    <ol className="flex list-decimal flex-col gap-2 pl-5 text-foreground-2 text-sm leading-relaxed">
      <li>{m.integrations_enable_banking_step_create()}</li>
      <li>
        {m.integrations_enable_banking_step_redirect()}
        <span className="mt-1.5 flex items-center gap-2">
          <code
            className="min-w-0 break-all rounded-md border bg-muted px-2.5 py-1.5 font-mono text-foreground-hi text-xs"
            data-testid="enable-banking-redirect-url"
          >
            {redirectUrl}
          </code>
          <CopyButton
            aria-label={m.integrations_enable_banking_copy_redirect()}
            copiedLabel={m.common_copied()}
            failedLabel={m.common_copy_failed()}
            size="icon"
            value={redirectUrl}
          />
        </span>
      </li>
      <li>{m.integrations_enable_banking_step_link()}</li>
      <li>{m.integrations_enable_banking_step_paste()}</li>
    </ol>
  );
}

type CredentialsFormProps = {
  onSave: (
    values: SaveEnableBankingCredentialsData,
  ) => Promise<FormSubmitResult>;
  /** Null while nothing is saved yet: there is no application to fall back to. */
  onCancel: (() => void) | null;
};

function CredentialsForm({ onSave, onCancel }: CredentialsFormProps) {
  const keyFileInput = useRef<HTMLInputElement>(null);
  const [keyFileError, setKeyFileError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { applicationId: "", privateKey: "" },
    validators: {
      onSubmit: zSaveEnableBankingCredentialsData,
      onSubmitAsync: async ({ value }) => {
        const result = await onSave({
          applicationId: value.applicationId.trim(),
          privateKey: value.privateKey.trim(),
        });

        return result.status === "invalid"
          ? { fields: result.fieldErrors }
          : null;
      },
    },
  });

  const readKeyFile = async (file: File | undefined) => {
    setKeyFileError(null);

    if (file === undefined) {
      return;
    }

    try {
      form.setFieldValue("privateKey", await file.text());
    } catch {
      setKeyFileError(m.integrations_enable_banking_key_file_failed());
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="applicationId">
        {(field) => (
          <FormTextField
            field={field}
            font="mono"
            formatOnBlur={(value) => value.trim()}
            label={m.integrations_enable_banking_application_id_label()}
            testId="enable-banking-application-id"
          />
        )}
      </form.Field>
      <form.Field name="privateKey">
        {(field) => (
          <FormTextField
            description={m.integrations_enable_banking_private_key_help()}
            field={field}
            inputClassName="max-h-40 font-mono"
            label={m.integrations_enable_banking_private_key_label()}
            multiline
            placeholder="-----BEGIN PRIVATE KEY-----"
            testId="enable-banking-private-key"
          />
        )}
      </form.Field>
      {keyFileError === null ? null : <FieldError>{keyFileError}</FieldError>}
      <input
        accept=".pem,.key,text/plain"
        className="hidden"
        data-testid="enable-banking-key-file"
        onChange={(event) => {
          void readKeyFile(event.target.files?.[0]);
          event.target.value = "";
        }}
        ref={keyFileInput}
        type="file"
      />
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <div className="flex flex-wrap gap-2">
            <Button
              data-testid="enable-banking-save"
              disabled={isSubmitting}
              size="lg"
              type="submit"
            >
              {m.integrations_enable_banking_save()}
            </Button>
            <Button
              onClick={() => keyFileInput.current?.click()}
              size="lg"
              type="button"
              variant="secondary"
            >
              <FileKey aria-hidden data-icon="inline-start" />
              {m.integrations_enable_banking_key_file()}
            </Button>
            {onCancel === null ? null : (
              <Button
                onClick={onCancel}
                size="lg"
                type="button"
                variant="ghost"
              >
                {m.common_cancel()}
              </Button>
            )}
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

function RemoveButton({
  isRemoving,
  onRemove,
}: {
  isRemoving: boolean;
  onRemove: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            data-testid="enable-banking-remove"
            disabled={isRemoving}
            size="lg"
            variant="destructive"
          />
        }
      >
        {m.integrations_enable_banking_remove()}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {m.integrations_enable_banking_remove_confirm_title()}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {m.integrations_enable_banking_remove_confirm_body()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{m.common_cancel()}</AlertDialogCancel>
          <AlertDialogAction
            data-testid="enable-banking-remove-confirm"
            onClick={onRemove}
            render={<Button size="2xl" variant="destructive" />}
          >
            {m.integrations_enable_banking_remove()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
