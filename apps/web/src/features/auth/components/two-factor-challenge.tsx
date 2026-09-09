import type { TwoFactorMethod } from "@opusline/api-client";
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
import { CircleAlert, Fingerprint } from "lucide-react";
import { useId, useState } from "react";

import { TOTP_CODE_LENGTH, TotpCodeField } from "@/components/totp-code-field";
import { m } from "@/paraglide/messages.js";

export type ChallengeOutcome =
  | { status: "success" }
  | { status: "invalid"; message: string }
  | { status: "failed" };

type TwoFactorChallengeProps = {
  methods: TwoFactorMethod[];
  onSubmitCode: (
    code: string,
    rememberDevice: boolean,
  ) => Promise<ChallengeOutcome>;
  onSubmitRecoveryCode: (
    code: string,
    rememberDevice: boolean,
  ) => Promise<ChallengeOutcome>;
  /** Present when this browser can answer with a passkey. */
  onUsePasskey?: (rememberDevice: boolean) => Promise<ChallengeOutcome>;
  onBack: () => void;
  isPending: boolean;
  error: string | null;
};

type Mode = "code" | "recovery" | "passkey";

const TOTP: TwoFactorMethod = 0;
const PASSKEY: TwoFactorMethod = 1;

/** The second step of a login: a six-digit code, or a recovery code instead. */
export function TwoFactorChallenge({
  methods,
  onSubmitCode,
  onSubmitRecoveryCode,
  onUsePasskey,
  onBack,
  isPending,
  error,
}: TwoFactorChallengeProps) {
  const codeId = useId();
  const recoveryId = useId();
  const rememberId = useId();
  const hasTotp = methods.includes(TOTP);
  const hasPasskey = methods.includes(PASSKEY) && onUsePasskey !== undefined;
  // An account without an authenticator app leads with its passkey; the
  // recovery code stays one click away either way.
  const [mode, setMode] = useState<Mode>(
    hasTotp ? "code" : hasPasskey ? "passkey" : "recovery",
  );
  const [code, setCode] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleOutcome = (outcome: ChallengeOutcome) => {
    if (outcome.status === "invalid") {
      setFieldError(outcome.message);
      setCode("");
    }
  };

  const submitCode = async (value: string) => {
    if (value.length !== TOTP_CODE_LENGTH || isPending) {
      return;
    }

    setFieldError(null);
    handleOutcome(await onSubmitCode(value, rememberDevice));
  };

  const submitRecoveryCode = async () => {
    const trimmed = recoveryCode.trim();

    if (trimmed === "" || isPending) {
      return;
    }

    setFieldError(null);
    handleOutcome(await onSubmitRecoveryCode(trimmed, rememberDevice));
  };

  const continueWithPasskey = async () => {
    if (onUsePasskey === undefined || isPending) {
      return;
    }

    setFieldError(null);
    handleOutcome(await onUsePasskey(rememberDevice));
  };

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode);
    setFieldError(null);
    setCode("");
    setRecoveryCode("");
  };

  const isInvalid = fieldError !== null;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void (mode === "code"
          ? submitCode(code)
          : mode === "recovery"
            ? submitRecoveryCode()
            : continueWithPasskey());
      }}
    >
      {error ? (
        <Alert variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {mode === "code" ? (
        <Field data-invalid={isInvalid}>
          <FieldLabel htmlFor={codeId}>
            {m.auth_two_factor_code_label()}
          </FieldLabel>
          <TotpCodeField
            autoFocus
            disabled={isPending}
            id={codeId}
            invalid={isInvalid}
            onChange={setCode}
            onComplete={(value) => void submitCode(value)}
            value={code}
          />
          {isInvalid ? (
            <FieldError>{fieldError}</FieldError>
          ) : (
            <FieldDescription>{m.auth_two_factor_code_hint()}</FieldDescription>
          )}
        </Field>
      ) : mode === "passkey" ? (
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground-3 text-sm leading-relaxed">
            {m.auth_two_factor_passkey_hint()}
          </p>
          {isInvalid ? <FieldError>{fieldError}</FieldError> : null}
        </div>
      ) : (
        <Field data-invalid={isInvalid}>
          <FieldLabel htmlFor={recoveryId}>
            {m.auth_two_factor_recovery_label()}
          </FieldLabel>
          <Input
            aria-invalid={isInvalid}
            autoComplete="off"
            autoFocus
            disabled={isPending}
            font="mono"
            id={recoveryId}
            onChange={(event) => setRecoveryCode(event.target.value)}
            spellCheck={false}
            value={recoveryCode}
          />
          {isInvalid ? (
            <FieldError>{fieldError}</FieldError>
          ) : (
            <FieldDescription>
              {m.auth_two_factor_recovery_hint()}
            </FieldDescription>
          )}
        </Field>
      )}

      <Field orientation="horizontal">
        <Checkbox
          checked={rememberDevice}
          disabled={isPending}
          id={rememberId}
          onCheckedChange={(checked) => setRememberDevice(checked === true)}
        />
        <FieldLabel htmlFor={rememberId}>
          {m.auth_two_factor_remember_label()}
        </FieldLabel>
      </Field>

      <Button
        className="mt-1 w-full"
        disabled={
          isPending ||
          (mode === "code"
            ? code.length !== TOTP_CODE_LENGTH
            : mode === "recovery"
              ? recoveryCode.trim() === ""
              : false)
        }
        size="2xl"
        type="submit"
      >
        {mode === "passkey" ? (
          <>
            <Fingerprint data-icon="inline-start" />
            {m.auth_two_factor_passkey_submit()}
          </>
        ) : (
          m.auth_two_factor_submit()
        )}
      </Button>

      <div className="flex flex-col items-center gap-1">
        {hasTotp && mode !== "code" ? (
          <Button
            disabled={isPending}
            onClick={() => switchMode("code")}
            size="sm"
            type="button"
            variant="ghost"
          >
            {m.auth_two_factor_use_code()}
          </Button>
        ) : null}
        {hasPasskey && mode !== "passkey" ? (
          <Button
            disabled={isPending}
            onClick={() => switchMode("passkey")}
            size="sm"
            type="button"
            variant="ghost"
          >
            {m.auth_two_factor_use_passkey()}
          </Button>
        ) : null}
        {mode !== "recovery" ? (
          <Button
            disabled={isPending}
            onClick={() => switchMode("recovery")}
            size="sm"
            type="button"
            variant="ghost"
          >
            {m.auth_two_factor_use_recovery()}
          </Button>
        ) : null}
        <Button
          disabled={isPending}
          onClick={onBack}
          size="sm"
          type="button"
          variant="link"
        >
          {m.auth_two_factor_back()}
        </Button>
      </div>
    </form>
  );
}
