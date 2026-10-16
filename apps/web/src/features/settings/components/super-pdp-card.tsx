import type {
  EInvoicingSettingsData,
  PlatformEnvironment,
  SaveSuperPdpCredentialsData,
} from "@opusline/api-client";
import { zSaveSuperPdpCredentialsData } from "@opusline/api-client/zod";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import {
  StatusRow,
  StatusRowActions,
  StatusRowContent,
  StatusRowDescription,
  StatusRowMedia,
  StatusRowTitle,
} from "@opusline/ui/components/status-row";
import { TextLink } from "@opusline/ui/components/text-link";
import { useForm } from "@tanstack/react-form";
import {
  Building2,
  CircleAlert,
  CircleCheck,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";

import { FormTextField } from "@/components/form-text-field";
import { useLocale } from "@/components/money-format-provider";
import { fullDateTimeLabel } from "@/lib/dates";
import { eInvoicingErrorLabel } from "@/lib/e-invoicing";
import type { FormSubmitResult } from "@/lib/form";
import { m } from "@/paraglide/messages.js";
import { CopyableCode } from "./copyable-code";
import { IntegrationRemoveButton } from "./integration-remove-button";
import { SettingsSection } from "./settings-section";

const SETUP_GUIDE =
  "https://github.com/opusline/opusline/blob/main/docs/e-invoicing.md";
const SCOPES = "invoice:read invoice:write company:read";

type EnvironmentToken = "sandbox" | "production";

const ENVIRONMENT_TOKENS: Record<PlatformEnvironment, EnvironmentToken> = {
  0: "sandbox",
  1: "production",
};

const ENVIRONMENT_LABELS: Record<EnvironmentToken, () => string> = {
  sandbox: () => m.integrations_super_pdp_environment_sandbox(),
  production: () => m.integrations_super_pdp_environment_production(),
};

type CardStatus = "unconfigured" | "unverified" | "connected";

type SuperPdpCardProps = {
  settings: EInvoicingSettingsData;
  isChecking: boolean;
  isRemoving: boolean;
  error: string | null;
  onSave: (values: SaveSuperPdpCredentialsData) => Promise<FormSubmitResult>;
  /** Resolves to whether the platform answered; the card says so. */
  onCheck: () => Promise<boolean>;
  onRemove: () => void;
};

function cardStatus(settings: EInvoicingSettingsData): CardStatus {
  if (settings.clientId === null) {
    return "unconfigured";
  }

  return settings.companyVerified ? "connected" : "unverified";
}

/**
 * The account's own Super PDP application: how to create one, the two values
 * Opusline needs from it, and what the platform last said about the company.
 * The client secret is write-only; once saved the card shows the client id.
 */
export function SuperPdpCard({
  settings,
  isChecking,
  isRemoving,
  error,
  onSave,
  onCheck,
  onRemove,
}: SuperPdpCardProps) {
  const [isReplacing, setIsReplacing] = useState(false);
  const [justDid, setJustDid] = useState<"saved" | "checked" | null>(null);
  const { clientId } = settings;

  return (
    <SettingsSection
      description={m.integrations_super_pdp_description()}
      title={m.integrations_super_pdp_title()}
    >
      <div
        className="flex flex-col gap-5"
        data-status={cardStatus(settings)}
        data-testid="super-pdp-card"
      >
        {error === null ? null : (
          <Alert variant="warn">
            <CircleAlert />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {justDid === null || clientId === null ? null : (
          <Alert data-testid="super-pdp-notice" variant="success">
            <CircleCheck />
            <AlertDescription>
              {justDid === "saved"
                ? m.integrations_super_pdp_saved()
                : m.integrations_super_pdp_checked_ok()}
            </AlertDescription>
          </Alert>
        )}

        {clientId === null || isReplacing ? (
          <>
            <SetupSteps />
            <CredentialsForm
              onCancel={clientId === null ? null : () => setIsReplacing(false)}
              onSave={async (values) => {
                setJustDid(null);
                const result = await onSave(values);

                if (result.status === "success") {
                  setIsReplacing(false);
                  setJustDid("saved");
                }

                return result;
              }}
            />
          </>
        ) : (
          <ConnectionStatus
            isChecking={isChecking}
            isRemoving={isRemoving}
            onCheck={async () => {
              setJustDid(null);
              setJustDid((await onCheck()) ? "checked" : null);
            }}
            onRemove={onRemove}
            onReplace={() => setIsReplacing(true)}
            settings={settings}
          />
        )}

        <TextLink
          className="inline-flex items-center gap-1.5 self-start"
          href={SETUP_GUIDE}
          rel="noreferrer"
          size="sm"
          target="_blank"
          underline="hover"
        >
          {m.integrations_super_pdp_docs()}
          <ExternalLink aria-hidden className="size-3.5" />
        </TextLink>
      </div>
    </SettingsSection>
  );
}

function SetupSteps() {
  return (
    <ol className="flex list-decimal flex-col gap-2 pl-5 text-foreground-2 text-sm leading-relaxed">
      <li>{m.integrations_super_pdp_step_account()}</li>
      <li>{m.integrations_super_pdp_step_verify()}</li>
      <li>{m.integrations_super_pdp_step_directory()}</li>
      <li>
        {m.integrations_super_pdp_step_application()}
        <CopyableCode
          copyLabel={m.integrations_super_pdp_copy_scopes()}
          testId="super-pdp-scopes"
          value={SCOPES}
        />
      </li>
      <li>{m.integrations_super_pdp_step_paste()}</li>
    </ol>
  );
}

type CredentialsFormProps = {
  onSave: (values: SaveSuperPdpCredentialsData) => Promise<FormSubmitResult>;
  /** Null while nothing is saved yet: there is no application to fall back to. */
  onCancel: (() => void) | null;
};

function CredentialsForm({ onSave, onCancel }: CredentialsFormProps) {
  const form = useForm({
    defaultValues: { clientId: "", clientSecret: "" },
    validators: {
      onSubmit: zSaveSuperPdpCredentialsData,
      onSubmitAsync: async ({ value }) => {
        const result = await onSave({
          clientId: value.clientId.trim(),
          clientSecret: value.clientSecret.trim(),
        });

        return result.status === "invalid"
          ? { fields: result.fieldErrors }
          : null;
      },
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="clientId">
        {(field) => (
          <FormTextField
            field={field}
            font="mono"
            formatOnBlur={(value) => value.trim()}
            label={m.integrations_super_pdp_client_id_label()}
            testId="super-pdp-client-id"
          />
        )}
      </form.Field>
      <form.Field name="clientSecret">
        {(field) => (
          <FormTextField
            description={m.integrations_super_pdp_client_secret_help()}
            field={field}
            font="mono"
            label={m.integrations_super_pdp_client_secret_label()}
            testId="super-pdp-client-secret"
            type="password"
          />
        )}
      </form.Field>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <div className="flex flex-wrap gap-2">
            <Button
              data-testid="super-pdp-save"
              disabled={isSubmitting}
              size="lg"
              type="submit"
            >
              {m.integrations_super_pdp_save()}
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

type ConnectionStatusProps = {
  settings: EInvoicingSettingsData;
  isChecking: boolean;
  isRemoving: boolean;
  onCheck: () => void;
  onReplace: () => void;
  onRemove: () => void;
};

function ConnectionStatus({
  settings,
  isChecking,
  isRemoving,
  onCheck,
  onReplace,
  onRemove,
}: ConnectionStatusProps) {
  const locale = useLocale();
  const environment =
    settings.environment === null
      ? null
      : ENVIRONMENT_TOKENS[settings.environment];

  return (
    <div className="flex flex-col gap-4">
      {settings.companyVerified ? null : (
        <Alert data-testid="super-pdp-unverified" variant="warn">
          <CircleAlert />
          <AlertDescription>
            {m.integrations_super_pdp_unverified()}
          </AlertDescription>
        </Alert>
      )}
      {settings.lastError === null ? null : (
        <Alert data-testid="super-pdp-sync-error" variant="warn">
          <CircleAlert />
          <AlertDescription>
            {eInvoicingErrorLabel(settings.lastError)}
          </AlertDescription>
        </Alert>
      )}
      <StatusRow>
        <StatusRowMedia>
          <Building2 aria-hidden />
        </StatusRowMedia>
        <StatusRowContent>
          <StatusRowTitle className="flex flex-wrap items-center gap-2">
            {settings.companyName ?? settings.clientId}
            {environment === null ? null : (
              <Badge
                data-environment={environment}
                data-testid="super-pdp-environment"
                variant={environment === "production" ? "success" : "neutral"}
              >
                {ENVIRONMENT_LABELS[environment]()}
              </Badge>
            )}
          </StatusRowTitle>
          <StatusRowDescription className="flex flex-col gap-0.5">
            {settings.companyNumber === null ? null : (
              <span className="font-mono">
                {m.integrations_super_pdp_company({
                  number: settings.companyNumber,
                })}
              </span>
            )}
            {settings.receivingAddress === null ? (
              <span data-testid="super-pdp-no-address">
                {m.integrations_super_pdp_no_address()}
              </span>
            ) : (
              <span
                className="font-mono"
                data-address={settings.receivingAddress}
                data-testid="super-pdp-receiving-address"
              >
                {m.integrations_super_pdp_address({
                  address: settings.receivingAddress,
                })}
              </span>
            )}
            {environment === "sandbox" ? (
              <span>{m.integrations_super_pdp_sandbox_hint()}</span>
            ) : null}
            {settings.checkedAt === null ? null : (
              <span>
                {m.integrations_super_pdp_checked({
                  date: fullDateTimeLabel(locale, settings.checkedAt),
                })}
              </span>
            )}
            {settings.lastSyncedAt === null ? null : (
              <span data-testid="super-pdp-last-sync">
                {m.integrations_super_pdp_last_sync({
                  date: fullDateTimeLabel(locale, settings.lastSyncedAt),
                })}
              </span>
            )}
          </StatusRowDescription>
        </StatusRowContent>
        <StatusRowActions>
          <Button
            data-testid="super-pdp-check"
            disabled={isChecking}
            onClick={onCheck}
            size="lg"
            variant="secondary"
          >
            <RefreshCw aria-hidden data-icon="inline-start" />
            {m.integrations_super_pdp_check()}
          </Button>
          <Button
            data-testid="super-pdp-replace"
            onClick={onReplace}
            size="lg"
            variant="secondary"
          >
            {m.integrations_super_pdp_replace()}
          </Button>
          <IntegrationRemoveButton
            confirmBody={m.integrations_super_pdp_remove_confirm_body()}
            confirmTitle={m.integrations_super_pdp_remove_confirm_title()}
            isRemoving={isRemoving}
            label={m.integrations_super_pdp_remove()}
            onRemove={onRemove}
            testId="super-pdp-remove"
          />
        </StatusRowActions>
      </StatusRow>
    </div>
  );
}
