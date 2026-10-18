import type {
  AnthropicSettingsData,
  SaveAnthropicApiKeyData,
} from "@opusline/api-client";
import { zSaveAnthropicApiKeyData } from "@opusline/api-client/zod";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
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
import { CircleAlert, ExternalLink, Sparkles } from "lucide-react";
import { useState } from "react";
import * as z from "zod/mini";

import { FormTextField } from "@/components/form-text-field";
import type { FormSubmitResult } from "@/lib/form";
import { m } from "@/paraglide/messages.js";
import { IntegrationRemoveButton } from "./integration-remove-button";
import { SettingsSection } from "./settings-section";

const CONSOLE_KEYS_URL = "https://console.anthropic.com/settings/keys";

/** A pasted key often carries a newline: checked as it will be sent, trimmed. */
const apiKeyFormSchema = z.object({
  apiKey: z.pipe(
    z.string().check(z.trim()),
    zSaveAnthropicApiKeyData.shape.apiKey,
  ),
});

type AnthropicCardProps = {
  settings: AnthropicSettingsData;
  isRemoving: boolean;
  error: string | null;
  onSave: (values: SaveAnthropicApiKeyData) => Promise<FormSubmitResult>;
  onRemove: () => void;
};

/**
 * The account's own Anthropic key, which lets Claude read its receipts. The
 * key is write-only: once saved, the card only says that one is there.
 */
export function AnthropicCard({
  settings,
  isRemoving,
  error,
  onSave,
  onRemove,
}: AnthropicCardProps) {
  const [isReplacing, setIsReplacing] = useState(false);

  return (
    <SettingsSection
      description={m.integrations_anthropic_description()}
      title={m.integrations_anthropic_title()}
    >
      <div
        className="flex flex-col gap-5"
        data-status={settings.hasApiKey ? "configured" : "unconfigured"}
        data-testid="anthropic-card"
      >
        {error === null ? null : (
          <Alert variant="warn">
            <CircleAlert />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!settings.hasApiKey || isReplacing ? (
          <ApiKeyForm
            onCancel={settings.hasApiKey ? () => setIsReplacing(false) : null}
            onSave={async (values) => {
              const result = await onSave(values);

              if (result.status === "success") {
                setIsReplacing(false);
              }

              return result;
            }}
          />
        ) : (
          <StatusRow>
            <StatusRowMedia>
              <Sparkles aria-hidden />
            </StatusRowMedia>
            <StatusRowContent>
              <StatusRowTitle>
                {m.integrations_anthropic_saved_title()}
              </StatusRowTitle>
              <StatusRowDescription>
                {m.integrations_anthropic_saved_detail({
                  model: settings.model,
                })}
              </StatusRowDescription>
            </StatusRowContent>
            <StatusRowActions>
              <Button
                data-testid="anthropic-replace"
                onClick={() => setIsReplacing(true)}
                size="lg"
                variant="secondary"
              >
                {m.integrations_anthropic_replace()}
              </Button>
              <IntegrationRemoveButton
                confirmBody={m.integrations_anthropic_remove_confirm_body()}
                confirmTitle={m.integrations_anthropic_remove_confirm_title()}
                isRemoving={isRemoving}
                label={m.integrations_anthropic_remove()}
                onRemove={onRemove}
                testId="anthropic-remove"
              />
            </StatusRowActions>
          </StatusRow>
        )}

        <TextLink
          className="inline-flex items-center gap-1.5 self-start"
          href={CONSOLE_KEYS_URL}
          rel="noreferrer"
          size="sm"
          target="_blank"
          underline="hover"
        >
          {m.integrations_anthropic_console()}
          <ExternalLink aria-hidden className="size-3.5" />
        </TextLink>
      </div>
    </SettingsSection>
  );
}

type ApiKeyFormProps = {
  onSave: (values: SaveAnthropicApiKeyData) => Promise<FormSubmitResult>;
  /** Null while no key is saved yet: there is none to fall back to. */
  onCancel: (() => void) | null;
};

function ApiKeyForm({ onSave, onCancel }: ApiKeyFormProps) {
  const form = useForm({
    defaultValues: { apiKey: "" },
    validators: {
      onSubmit: apiKeyFormSchema,
      onSubmitAsync: async ({ value }) => {
        const result = await onSave({ apiKey: value.apiKey.trim() });

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
      <form.Field name="apiKey">
        {(field) => (
          <FormTextField
            description={m.integrations_anthropic_key_help()}
            field={field}
            font="mono"
            formatOnBlur={(value) => value.trim()}
            label={m.integrations_anthropic_key_label()}
            placeholder="sk-ant-…"
            testId="anthropic-api-key"
            type="password"
          />
        )}
      </form.Field>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <div className="flex flex-wrap gap-2">
            <Button
              data-testid="anthropic-save"
              disabled={isSubmitting}
              size="lg"
              type="submit"
            >
              {m.integrations_anthropic_save()}
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
