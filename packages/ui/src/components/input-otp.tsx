import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { OTPInput, OTPInputContext, REGEXP_ONLY_DIGITS } from "input-otp";
import { MinusIcon } from "lucide-react";
import * as React from "react";

const inputOTPVariants = cva(
  "cn-input-otp flex items-center has-disabled:opacity-50",
  {
    variants: {
      /** `lg` stretches the slots across the whole container, for a code that is the only field of its screen. */
      size: {
        default: "",
        lg: "w-full gap-2",
      },
    },
    defaultVariants: { size: "default" },
  },
);

const inputOTPGroupVariants = cva(
  "flex items-center rounded-md has-aria-invalid:border-destructive has-aria-invalid:ring-2 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        default: "",
        lg: "flex-1",
      },
    },
    defaultVariants: { size: "default" },
  },
);

const inputOTPSlotVariants = cva(
  "relative flex items-center justify-center border-y border-r border-input bg-input/20 transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-2 data-[active=true]:ring-ring/30 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        default: "size-7 text-xs/relaxed",
        lg: "h-12 min-w-0 flex-1 text-lg tabular-nums",
      },
    },
    defaultVariants: { size: "default" },
  },
);

type InputOTPSize = VariantProps<typeof inputOTPVariants>["size"];

/** The input's own numeric `size` attribute gives way to the variant; distributed, so render-prop and children forms both survive. */
type OTPInputPropsWithoutSize<Props = React.ComponentProps<typeof OTPInput>> =
  Props extends unknown ? Omit<Props, "size"> : never;

const InputOTPSizeContext = React.createContext<InputOTPSize>("default");

function InputOTP({
  className,
  containerClassName,
  size,
  ...props
}: OTPInputPropsWithoutSize & {
  containerClassName?: string;
  size?: InputOTPSize;
}) {
  return (
    <InputOTPSizeContext.Provider value={size}>
      <OTPInput
        data-slot="input-otp"
        containerClassName={cn(inputOTPVariants({ size }), containerClassName)}
        spellCheck={false}
        className={cn("disabled:cursor-not-allowed", className)}
        {...props}
      />
    </InputOTPSizeContext.Provider>
  );
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  const size = React.useContext(InputOTPSizeContext);

  return (
    <div
      data-slot="input-otp-group"
      className={cn(inputOTPGroupVariants({ size }), className)}
      {...props}
    />
  );
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const size = React.useContext(InputOTPSizeContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(inputOTPSlotVariants({ size }), className)}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      data-slot="input-otp-separator"
      className={cn(
        "flex items-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <MinusIcon />
    </div>
  );
}

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
};
