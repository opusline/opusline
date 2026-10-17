import type {
  AccessTokenData,
  Locale,
  TokenAbility,
} from "@opusline/api-client";
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
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@opusline/ui/components/empty";
import {
  StatusRow,
  StatusRowActions,
  StatusRowContent,
  StatusRowDescription,
  StatusRowMedia,
  StatusRowTitle,
} from "@opusline/ui/components/status-row";
import { CircleAlert, KeySquare, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { fullDateLabel } from "@/lib/dates";
import type { FormSubmitResult } from "@/lib/form";
import { m } from "@/paraglide/messages.js";
import { ApiTokenDialog } from "./api-token-dialog";
import { SettingsSection } from "./settings-section";

const ABILITY_LABELS: Record<TokenAbility, () => string> = {
  "invoices:read": () => m.security_token_ability_invoices_read(),
};

type ApiTokensCardProps = {
  tokens: AccessTokenData[];
  locale: Locale;
  isPending: boolean;
  error: string | null;
  /** The secret of the token just created; the card shows it once, until dismissed. */
  createdToken: string | null;
  onCreate: (name: string) => Promise<FormSubmitResult>;
  onDismissCreated: () => void;
  onRevoke: (id: number) => void;
};

export function ApiTokensCard({
  tokens,
  locale,
  isPending,
  error,
  createdToken,
  onCreate,
  onDismissCreated,
  onRevoke,
}: ApiTokensCardProps) {
  const [isNaming, setIsNaming] = useState(false);

  const closeDialog = () => {
    setIsNaming(false);
    onDismissCreated();
  };

  const addButton = (
    <Button
      data-testid="api-token-create"
      disabled={isPending}
      onClick={() => setIsNaming(true)}
      size="lg"
      variant={tokens.length === 0 ? "default" : "outline"}
    >
      <Plus data-icon="inline-start" />
      {m.security_token_add()}
    </Button>
  );

  return (
    <SettingsSection
      description={m.security_token_description()}
      title={m.security_token_title()}
    >
      {error === null ? null : (
        <Alert className="mb-3.5" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {tokens.length === 0 ? (
        <Empty surface="dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <KeySquare />
            </EmptyMedia>
            <EmptyDescription>{m.security_token_empty()}</EmptyDescription>
          </EmptyHeader>
          {addButton}
        </Empty>
      ) : (
        <>
          <div className="divide-y rounded-md border">
            {tokens.map((token) => (
              <StatusRow
                data-testid="api-token-row"
                data-token={token.id}
                key={token.id}
                surface="plain"
              >
                <StatusRowMedia>
                  <KeySquare />
                </StatusRowMedia>
                <StatusRowContent>
                  <StatusRowTitle>
                    {token.name}
                    {token.abilities.map((ability) => (
                      <Badge key={ability} variant="neutral">
                        {ABILITY_LABELS[ability]()}
                      </Badge>
                    ))}
                  </StatusRowTitle>
                  <StatusRowDescription>
                    {token.lastUsedAt === null
                      ? m.security_token_usage_unused({
                          created: fullDateLabel(locale, token.createdAt),
                        })
                      : m.security_token_usage({
                          created: fullDateLabel(locale, token.createdAt),
                          lastUsed: fullDateLabel(locale, token.lastUsedAt),
                        })}
                  </StatusRowDescription>
                </StatusRowContent>
                <StatusRowActions>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          aria-label={m.security_token_revoke()}
                          data-testid="api-token-revoke"
                          disabled={isPending}
                          size="icon-lg"
                          variant="destructive"
                        />
                      }
                    >
                      <Trash2 />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {m.security_token_revoke_confirm_title()}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {m.security_token_revoke_confirm_body()}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {m.common_cancel()}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onRevoke(token.id)}
                          render={<Button size="2xl" variant="destructive" />}
                        >
                          {m.security_token_revoke()}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </StatusRowActions>
              </StatusRow>
            ))}
          </div>
          <div className="mt-3.5">{addButton}</div>
        </>
      )}

      <ApiTokenDialog
        createdToken={createdToken}
        isPending={isPending}
        onClose={closeDialog}
        onSubmit={onCreate}
        open={isNaming || createdToken !== null}
      />
    </SettingsSection>
  );
}
