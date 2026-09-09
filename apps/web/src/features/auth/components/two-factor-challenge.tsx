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
import { CircleAlert } from "lucide-react";
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
  onBack: () => void;
  isPending: boolean;
  error: string | null;
};

/** The second step of a login: a six-digit code, or a recovery code instead. */
export function TwoFactorChallenge({
  onSubmitCode,
  onSubmitRecoveryCode,
  onBack,
  isPending,
  error,
}: TwoFactorChallengeProps) {
  const codeId = useId();
  const recoveryId = useId();
  const rememberId = useId();
  const [mode, setMode] = useState<"code" | "recovery">("code");
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

  const switchMode = (nextMode: "code" | "recovery") => {
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
        void (mode === "code" ? submitCode(code) : submitRecoveryCode());
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
            : recoveryCode.trim() === "")
        }
        size="2xl"
        type="submit"
      >
        {m.auth_two_factor_submit()}
      </Button>

      <div className="flex flex-col items-center gap-1">
        <Button
          disabled={isPending}
          onClick={() => switchMode(mode === "code" ? "recovery" : "code")}
          size="sm"
          type="button"
          variant="ghost"
        >
          {mode === "code"
            ? m.auth_two_factor_use_recovery()
            : m.auth_two_factor_use_code()}
        </Button>
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
