import type { Locale, PasskeyData } from "@opusline/api-client";
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
import { CircleAlert, KeyRound, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { fullDateLabel } from "@/lib/dates";
import type { FormSubmitResult } from "@/lib/form";
import { m } from "@/paraglide/messages.js";
import { PasskeyNameDialog } from "./passkey-name-dialog";
import { SettingsSection } from "./settings-section";

type PasskeysCardProps = {
  passkeys: PasskeyData[];
  locale: Locale;
  /** Whether this browser can run a WebAuthn ceremony at all. */
  isSupported: boolean;
  isPending: boolean;
  error: string | null;
  onAdd: () => void;
  onRename: (id: number, name: string) => Promise<FormSubmitResult>;
  onDelete: (id: number) => void;
};

export function PasskeysCard({
  passkeys,
  locale,
  isSupported,
  isPending,
  error,
  onAdd,
  onRename,
  onDelete,
}: PasskeysCardProps) {
  const [renaming, setRenaming] = useState<PasskeyData | null>(null);

  const addButton = (
    <Button
      disabled={!isSupported || isPending}
      onClick={onAdd}
      size="lg"
      variant={passkeys.length === 0 ? "default" : "outline"}
    >
      <Plus data-icon="inline-start" />
      {m.security_passkey_add()}
    </Button>
  );

  return (
    <SettingsSection
      description={m.security_passkey_description()}
      title={m.security_passkey_title()}
    >
      {error === null ? null : (
        <Alert className="mb-3.5" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {passkeys.length === 0 ? (
        <Empty surface="dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <KeyRound />
            </EmptyMedia>
            <EmptyDescription>
              {isSupported
                ? m.security_passkey_empty()
                : m.security_passkey_unsupported()}
            </EmptyDescription>
          </EmptyHeader>
          {addButton}
        </Empty>
      ) : (
        <>
          <div className="divide-y rounded-md border">
            {passkeys.map((passkey) => (
              <StatusRow key={passkey.id} surface="plain">
                <StatusRowMedia>
                  <KeyRound />
                </StatusRowMedia>
                <StatusRowContent>
                  <StatusRowTitle>
                    {passkey.name}
                    {passkey.backedUp ? (
                      <Badge variant="neutral">
                        {m.security_passkey_synced()}
                      </Badge>
                    ) : null}
                  </StatusRowTitle>
                  <StatusRowDescription>
                    {passkey.lastUsedAt === null
                      ? m.security_passkey_never_used()
                      : m.security_passkey_last_used({
                          date: fullDateLabel(locale, passkey.lastUsedAt),
                        })}
                  </StatusRowDescription>
                </StatusRowContent>
                <StatusRowActions>
                  <Button
                    aria-label={m.security_passkey_rename()}
                    disabled={isPending}
                    onClick={() => setRenaming(passkey)}
                    size="icon-lg"
                    variant="outline"
                  >
                    <Pencil />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          aria-label={m.security_passkey_delete()}
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
                          {m.security_passkey_delete_confirm_title()}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {m.security_passkey_delete_confirm_body()}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {m.common_cancel()}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(passkey.id)}
                          render={<Button size="2xl" variant="destructive" />}
                        >
                          {m.security_passkey_delete()}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </StatusRowActions>
              </StatusRow>
            ))}
          </div>
          <div className="mt-3.5">
            {isSupported ? (
              addButton
            ) : (
              <p className="text-muted-foreground-3 text-sm">
                {m.security_passkey_unsupported()}
              </p>
            )}
          </div>
        </>
      )}

      <PasskeyNameDialog
        initialName={renaming?.name ?? ""}
        isPending={isPending}
        onCancel={() => setRenaming(null)}
        onSubmit={async (name) => {
          if (renaming === null) {
            return { status: "failed" };
          }

          const result = await onRename(renaming.id, name);

          if (result.status === "success") {
            setRenaming(null);
          }

          return result;
        }}
        open={renaming !== null}
        title={m.security_passkey_rename_title()}
      />
    </SettingsSection>
  );
}
