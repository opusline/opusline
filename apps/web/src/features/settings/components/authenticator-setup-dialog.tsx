import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { CopyButton } from "@opusline/ui/components/copy-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { QrCode } from "@opusline/ui/components/qr-code";
import { RecoveryCodes } from "@opusline/ui/components/recovery-codes";
import { TriangleAlert } from "lucide-react";
import { useId, useState } from "react";

import { TOTP_CODE_LENGTH, TotpCodeField } from "@/components/totp-code-field";
import type { FormSubmitResult } from "@/lib/form";
import { m } from "@/paraglide/messages.js";

export type TotpSetupState =
  | { step: "idle" }
  | { step: "scan"; secret: string; otpauthUri: string }
  | { step: "recovery"; codes: string[] };

type AuthenticatorSetupDialogProps = {
  state: TotpSetupState;
  isPending: boolean;
  onConfirm: (code: string) => Promise<FormSubmitResult>;
  onAcknowledgeRecoveryCodes: () => void;
  onCancel: () => void;
};

/** Scan, confirm with a code, then save the recovery codes: the enrolment in one dialog. */
export function AuthenticatorSetupDialog({
  state,
  isPending,
  onConfirm,
  onAcknowledgeRecoveryCodes,
  onCancel,
}: AuthenticatorSetupDialogProps) {
  // The recovery codes are shown once: the dialog only leaves that step through
  // the button that says they were saved.
  const isLocked = state.step === "recovery";

  return (
    <Dialog
      disablePointerDismissal
      onOpenChange={(open) => {
        if (!open && !isLocked) {
          onCancel();
        }
      }}
      open={state.step !== "idle"}
    >
      <DialogContent showCloseButton={!isLocked} size="lg">
        {state.step === "scan" ? (
          <ScanStep
            isPending={isPending}
            onConfirm={onConfirm}
            otpauthUri={state.otpauthUri}
            secret={state.secret}
          />
        ) : null}
        {state.step === "recovery" ? (
          <RecoveryStep
            codes={state.codes}
            onAcknowledge={onAcknowledgeRecoveryCodes}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ScanStep({
  secret,
  otpauthUri,
  isPending,
  onConfirm,
}: {
  secret: string;
  otpauthUri: string;
  isPending: boolean;
  onConfirm: (code: string) => Promise<FormSubmitResult>;
}) {
  const codeId = useId();
  const [showSecret, setShowSecret] = useState(false);
  const [code, setCode] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const confirm = async (value: string) => {
    if (value.length !== TOTP_CODE_LENGTH || isPending) {
      return;
    }

    setFieldError(null);
    const result = await onConfirm(value);

    if (result.status === "invalid") {
      setFieldError(
        result.fieldErrors.code?.message ?? m.common_action_failed(),
      );
      setCode("");
    } else if (result.status === "failed") {
      setFieldError(m.common_action_failed());
    }
  };

  const isInvalid = fieldError !== null;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        void confirm(code);
      }}
    >
      <DialogHeader className="gap-2">
        <DialogTitle size="lg">{m.security_totp_setup_title()}</DialogTitle>
        <DialogDescription size="lg">
          {m.security_totp_setup_scan_hint()}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center gap-3">
        <QrCode
          label={m.security_totp_setup_qr_label()}
          size="lg"
          value={otpauthUri}
        />
        <Button
          aria-expanded={showSecret}
          onClick={() => setShowSecret((current) => !current)}
          size="sm"
          type="button"
          variant="ghost"
        >
          {m.security_totp_setup_manual_toggle()}
        </Button>
        {showSecret ? (
          <div className="flex w-full items-center gap-2 rounded-md border bg-muted px-3 py-2">
            <span className="sr-only">
              {m.security_totp_setup_secret_label()}
            </span>
            <code className="flex-1 break-all font-mono text-foreground-hi text-sm tabular-nums">
              {groupInFours(secret)}
            </code>
            <CopyButton
              aria-label={m.common_copy()}
              copiedLabel={m.common_copied()}
              failedLabel={m.common_copy_failed()}
              size="icon"
              value={secret}
            />
          </div>
        ) : null}
      </div>

      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={codeId}>
          {m.security_totp_setup_code_label()}
        </FieldLabel>
        <TotpCodeField
          disabled={isPending}
          id={codeId}
          invalid={isInvalid}
          onChange={setCode}
          onComplete={(value) => void confirm(value)}
          value={code}
        />
        {isInvalid ? <FieldError>{fieldError}</FieldError> : null}
      </Field>

      <DialogFooter layout="inline">
        <Button
          disabled={isPending || code.length !== TOTP_CODE_LENGTH}
          size="2xl"
          type="submit"
        >
          {m.security_totp_setup_confirm()}
        </Button>
      </DialogFooter>
    </form>
  );
}

function RecoveryStep({
  codes,
  onAcknowledge,
}: {
  codes: string[];
  onAcknowledge: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <DialogHeader className="gap-2">
        <DialogTitle size="lg">{m.security_recovery_title()}</DialogTitle>
      </DialogHeader>
      <Alert variant="warn">
        <TriangleAlert />
        <AlertDescription>
          {m.security_recovery_once_warning()}
        </AlertDescription>
      </Alert>
      <RecoveryCodes
        codes={codes}
        copiedLabel={m.common_copied()}
        copyFailedLabel={m.common_copy_failed()}
        copyLabel={m.common_copy()}
        downloadFileName={m.security_recovery_file_name()}
        downloadLabel={m.security_recovery_download()}
        label={m.security_recovery_title()}
      />
      <DialogFooter layout="inline">
        <Button onClick={onAcknowledge} size="2xl" type="button">
          {m.security_recovery_saved()}
        </Button>
      </DialogFooter>
    </div>
  );
}

function groupInFours(secret: string): string {
  return secret.match(/.{1,4}/g)?.join(" ") ?? secret;
}
