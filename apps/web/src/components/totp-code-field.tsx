import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "@opusline/ui/components/input-otp";
import { useEffect, useRef } from "react";

export const TOTP_CODE_LENGTH = 6;

type TotpCodeFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Fires once the sixth digit lands: the code is complete, submit it. */
  onComplete: (value: string) => void;
  disabled: boolean;
  /** A refused code; the field takes focus back once it is enabled again. */
  invalid: boolean;
  autoFocus?: boolean;
};

/** The six-digit authenticator code, as the login challenge and the enrolment both ask for it. */
export function TotpCodeField({
  id,
  value,
  onChange,
  onComplete,
  disabled,
  invalid,
  autoFocus,
}: TotpCodeFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Submitting disables the field, which drops focus; after a refusal the
  // next attempt should start where the last one did.
  useEffect(() => {
    if (invalid && !disabled) {
      inputRef.current?.focus();
    }
  }, [invalid, disabled]);

  return (
    <InputOTP
      aria-invalid={invalid}
      autoFocus={autoFocus}
      disabled={disabled}
      id={id}
      maxLength={TOTP_CODE_LENGTH}
      onChange={onChange}
      onComplete={onComplete}
      pattern={REGEXP_ONLY_DIGITS}
      ref={inputRef}
      value={value}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
