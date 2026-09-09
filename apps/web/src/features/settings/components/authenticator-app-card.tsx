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
  StatusRow,
  StatusRowActions,
  StatusRowContent,
  StatusRowDescription,
  StatusRowMedia,
  StatusRowTitle,
} from "@opusline/ui/components/status-row";
import { CircleAlert, Smartphone, TriangleAlert } from "lucide-react";

import type { FormSubmitResult } from "@/lib/form";
import { m } from "@/paraglide/messages.js";
import {
  AuthenticatorSetupDialog,
  type TotpSetupState,
} from "./authenticator-setup-dialog";
import { SettingsSection } from "./settings-section";

const LOW_RECOVERY_CODES = 2;

type AuthenticatorAppCardProps = {
  totpEnabled: boolean;
  recoveryCodesRemaining: number;
  setup: TotpSetupState;
  isPending: boolean;
  error: string | null;
  onStartSetup: () => void;
  onConfirmSetup: (code: string) => Promise<FormSubmitResult>;
  onAcknowledgeRecoveryCodes: () => void;
  onCancelSetup: () => void;
  onRegenerateRecoveryCodes: () => void;
  onDisable: () => void;
};

export function AuthenticatorAppCard({
  totpEnabled,
  recoveryCodesRemaining,
  setup,
  isPending,
  error,
  onStartSetup,
  onConfirmSetup,
  onAcknowledgeRecoveryCodes,
  onCancelSetup,
  onRegenerateRecoveryCodes,
  onDisable,
}: AuthenticatorAppCardProps) {
  return (
    <SettingsSection
      description={m.security_totp_description()}
      title={m.security_totp_title()}
    >
      {error === null ? null : (
        <Alert className="mb-3.5" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {totpEnabled && recoveryCodesRemaining <= LOW_RECOVERY_CODES ? (
        <Alert className="mb-3.5" variant="warn">
          <TriangleAlert />
          <AlertDescription>
            {m.security_recovery_low_warning()}
          </AlertDescription>
        </Alert>
      ) : null}

      <StatusRow>
        <StatusRowMedia>
          <Smartphone />
        </StatusRowMedia>
        <StatusRowContent>
          <StatusRowTitle>
            {m.security_totp_title()}
            {totpEnabled ? (
              <Badge variant="success">{m.security_totp_status_on()}</Badge>
            ) : (
              <Badge variant="quiet">{m.security_totp_status_off()}</Badge>
            )}
          </StatusRowTitle>
          <StatusRowDescription>
            {totpEnabled
              ? m.security_recovery_codes_remaining({
                  count: recoveryCodesRemaining,
                })
              : m.security_totp_off_hint()}
          </StatusRowDescription>
        </StatusRowContent>
        <StatusRowActions>
          {totpEnabled ? (
            <>
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button disabled={isPending} size="lg" variant="outline" />
                  }
                >
                  {m.security_recovery_regenerate()}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {m.security_recovery_regenerate_confirm_title()}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {m.security_recovery_regenerate_confirm_body()}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{m.common_cancel()}</AlertDialogCancel>
                    <AlertDialogAction onClick={onRegenerateRecoveryCodes}>
                      {m.security_recovery_regenerate()}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      disabled={isPending}
                      size="lg"
                      variant="destructive"
                    />
                  }
                >
                  {m.security_totp_disable()}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {m.security_totp_disable_confirm_title()}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {m.security_totp_disable_confirm_body()}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{m.common_cancel()}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDisable}
                      render={<Button size="2xl" variant="destructive" />}
                    >
                      {m.security_totp_disable()}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <Button disabled={isPending} onClick={onStartSetup} size="lg">
              {m.security_totp_enable()}
            </Button>
          )}
        </StatusRowActions>
      </StatusRow>

      <AuthenticatorSetupDialog
        isPending={isPending}
        onAcknowledgeRecoveryCodes={onAcknowledgeRecoveryCodes}
        onCancel={onCancelSetup}
        onConfirm={onConfirmSetup}
        state={setup}
      />
    </SettingsSection>
  );
}
