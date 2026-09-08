import {
  confirmTotpMutation,
  deletePasskeyMutation,
  disableTotpMutation,
  passkeyRegistrationOptionsMutation,
  regenerateRecoveryCodesMutation,
  registerPasskeyMutation,
  renamePasskeyMutation,
  revokeAllTrustedDevicesMutation,
  revokeTrustedDeviceMutation,
  showTwoFactorOptions,
  showTwoFactorQueryKey,
  startTotpSetupMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import type { FormSubmitResult } from "@/lib/form";
import type { PasswordGuard } from "@/lib/password-confirmation";
import { serverErrorMessage, serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";
import { AuthenticatorAppCard } from "./authenticator-app-card";
import type { TotpSetupState } from "./authenticator-setup-dialog";
import { PasskeyNameDialog } from "./passkey-name-dialog";
import { PasskeysCard } from "./passkeys-card";
import { TrustedBrowsersCard } from "./trusted-browsers-card";

type WebAuthn = {
  isSupported: boolean;
  /** Runs the browser's registration ceremony on the API's options; resolves to the JSON the API stores. */
  createPasskey: (options: Record<string, unknown>) => Promise<string>;
  /** Names the browser-side failure, or null when the error is the API's. */
  failure: (
    error: unknown,
  ) => "cancelled" | "duplicate" | "unsupported" | "failed" | null;
};

type SecuritySettingsProps = {
  /** The route's password gate; the dialog it drives is rendered by the route. */
  guarded: PasswordGuard;
  /** The browser ceremony, injected so the tab stays a feature the route composes. */
  webAuthn: WebAuthn;
};

/** The Sécurité tab: owns the two-factor status and every write against it. */
export function SecuritySettings({ guarded, webAuthn }: SecuritySettingsProps) {
  const queryClient = useQueryClient();
  const { locale } = useMoneyFormat();
  const status = useQuery(showTwoFactorOptions());

  const [setup, setSetup] = useState<TotpSetupState>({ step: "idle" });
  const [totpError, setTotpError] = useState<string | null>(null);
  const [devicesError, setDevicesError] = useState<string | null>(null);
  const [passkeysError, setPasskeysError] = useState<string | null>(null);
  // The browser has minted a credential and the API is waiting for its name.
  const [pendingCredential, setPendingCredential] = useState<string | null>(
    null,
  );

  const startTotp = useMutation(startTotpSetupMutation());
  const confirmTotp = useMutation(confirmTotpMutation());
  const disableTotp = useMutation(disableTotpMutation());
  const regenerateCodes = useMutation(regenerateRecoveryCodesMutation());
  const revokeDevice = useMutation(revokeTrustedDeviceMutation());
  const revokeAllDevices = useMutation(revokeAllTrustedDevicesMutation());
  const registrationOptions = useMutation(passkeyRegistrationOptionsMutation());
  const registerPasskey = useMutation(registerPasskeyMutation());
  const renamePasskey = useMutation(renamePasskeyMutation());
  const deletePasskey = useMutation(deletePasskeyMutation());

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: showTwoFactorQueryKey() });

  const runTotpAction = async (action: () => Promise<void>) => {
    setTotpError(null);

    try {
      await guarded(action);
    } catch (error) {
      setTotpError(serverErrorMessage(error, m.common_action_failed()));
    }
  };

  const startSetup = () =>
    runTotpAction(async () => {
      const { secret, otpauthUri } = await startTotp.mutateAsync({});
      setSetup({ step: "scan", secret, otpauthUri });
    });

  const confirmSetup = async (code: string): Promise<FormSubmitResult> => {
    try {
      const { codes } = await confirmTotp.mutateAsync({ body: { code } });
      await refresh();
      setSetup({ step: "recovery", codes });

      return { status: "success" };
    } catch (error) {
      const fieldErrors = serverFieldErrors(error);

      if (fieldErrors !== null) {
        return { status: "invalid", fieldErrors };
      }

      // Anything but a wrong code (the app enabled from another tab, a setup
      // that was never started) is about the card, not the dialog.
      setTotpError(serverErrorMessage(error, m.common_action_failed()));
      setSetup({ step: "idle" });
      await refresh();

      return { status: "failed" };
    }
  };

  const regenerate = () =>
    runTotpAction(async () => {
      const { codes } = await regenerateCodes.mutateAsync({});
      await refresh();
      setSetup({ step: "recovery", codes });
    });

  const disable = () =>
    runTotpAction(async () => {
      await disableTotp.mutateAsync({});
      await refresh();
    });

  const runDevicesAction = async (action: () => Promise<unknown>) => {
    setDevicesError(null);

    try {
      await action();
      await refresh();
    } catch (error) {
      setDevicesError(serverErrorMessage(error, m.common_action_failed()));
    }
  };

  const addPasskey = async () => {
    setPasskeysError(null);

    try {
      const outcome = await guarded(() => registrationOptions.mutateAsync({}));

      if (outcome.status === "cancelled") {
        return;
      }

      setPendingCredential(await webAuthn.createPasskey(outcome.value.options));
    } catch (error) {
      const failure = webAuthn.failure(error);

      if (failure === "cancelled") {
        return;
      }

      setPasskeysError(
        failure === "duplicate"
          ? m.security_passkey_duplicate()
          : failure === null
            ? serverErrorMessage(error, m.common_action_failed())
            : m.security_passkey_failed(),
      );
    }
  };

  const savePasskey = async (name: string): Promise<FormSubmitResult> => {
    if (pendingCredential === null) {
      return { status: "failed" };
    }

    try {
      const outcome = await guarded(() =>
        registerPasskey.mutateAsync({
          body: { name, credential: pendingCredential },
        }),
      );

      if (outcome.status === "cancelled") {
        return { status: "failed" };
      }

      setPendingCredential(null);
      await refresh();

      return { status: "success" };
    } catch (error) {
      const fieldErrors = serverFieldErrors(error);

      // Only the name is the dialog's to fix; a refused credential is the
      // card's news, and the ceremony has to start over.
      if (fieldErrors !== null && fieldErrors.credential === undefined) {
        return { status: "invalid", fieldErrors };
      }

      setPasskeysError(serverErrorMessage(error, m.common_action_failed()));
      setPendingCredential(null);

      return { status: "failed" };
    }
  };

  const rename = async (
    id: number,
    name: string,
  ): Promise<FormSubmitResult> => {
    try {
      await renamePasskey.mutateAsync({
        path: { passkey: id },
        body: { name },
      });
      await refresh();

      return { status: "success" };
    } catch (error) {
      const fieldErrors = serverFieldErrors(error);

      return fieldErrors === null
        ? { status: "failed" }
        : { status: "invalid", fieldErrors };
    }
  };

  const removePasskey = async (id: number) => {
    setPasskeysError(null);

    try {
      await guarded(() => deletePasskey.mutateAsync({ path: { passkey: id } }));
      await refresh();
    } catch (error) {
      setPasskeysError(serverErrorMessage(error, m.common_delete_failed()));
    }
  };

  if (status.isPending) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (status.data === undefined) {
    return (
      <Alert variant="warn">
        <CircleAlert />
        <AlertDescription>
          {serverErrorMessage(status.error, m.security_load_failed())}
        </AlertDescription>
      </Alert>
    );
  }

  const isTotpPending =
    startTotp.isPending ||
    confirmTotp.isPending ||
    disableTotp.isPending ||
    regenerateCodes.isPending;

  return (
    <div className="flex flex-col gap-6">
      <AuthenticatorAppCard
        error={totpError}
        isPending={isTotpPending}
        onAcknowledgeRecoveryCodes={() => setSetup({ step: "idle" })}
        onCancelSetup={() => setSetup({ step: "idle" })}
        onConfirmSetup={confirmSetup}
        onDisable={() => void disable()}
        onRegenerateRecoveryCodes={() => void regenerate()}
        onStartSetup={() => void startSetup()}
        recoveryCodesRemaining={status.data.recoveryCodesRemaining}
        setup={setup}
        totpEnabled={status.data.totpEnabled}
      />
      <PasskeysCard
        error={passkeysError}
        isPending={
          registrationOptions.isPending ||
          registerPasskey.isPending ||
          renamePasskey.isPending ||
          deletePasskey.isPending
        }
        isSupported={webAuthn.isSupported}
        locale={locale}
        onAdd={() => void addPasskey()}
        onDelete={(id) => void removePasskey(id)}
        onRename={rename}
        passkeys={status.data.passkeys}
      />
      <PasskeyNameDialog
        initialName={m.security_passkey_default_name()}
        isPending={registerPasskey.isPending}
        onCancel={() => setPendingCredential(null)}
        onSubmit={savePasskey}
        open={pendingCredential !== null}
        title={m.security_passkey_name_title()}
      />
      <TrustedBrowsersCard
        devices={status.data.trustedDevices}
        error={devicesError}
        isPending={revokeDevice.isPending || revokeAllDevices.isPending}
        locale={locale}
        onRevoke={(id) =>
          void runDevicesAction(() =>
            revokeDevice.mutateAsync({ path: { trustedDevice: id } }),
          )
        }
        onRevokeAll={() =>
          void runDevicesAction(() => revokeAllDevices.mutateAsync({}))
        }
      />
    </div>
  );
}
