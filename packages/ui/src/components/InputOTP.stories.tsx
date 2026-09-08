import type { Meta, StoryObj } from "@storybook/react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "./input-otp";

type SixDigitsProps = {
  value?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
};

function SixDigits(props: SixDigitsProps) {
  return (
    <InputOTP
      aria-label="Code de vérification"
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
      {...props}
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

const meta = {
  title: "UI/InputOTP",
  component: SixDigits,
  tags: ["autodocs"],
} satisfies Meta<typeof SixDigits>;

export default meta;
type Story = StoryObj<typeof SixDigits>;

export const Default: Story = {};

export const Filled: Story = {
  args: { value: "482913" },
};

export const Invalid: Story = {
  args: { value: "482913", "aria-invalid": true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
