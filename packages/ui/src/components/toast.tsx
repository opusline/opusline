"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { Button } from "@opusline/ui/components/button";
import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";
import type { ReactNode } from "react";

const toastDotVariants = cva("mt-1.5 size-2 shrink-0 rounded-full", {
  variants: {
    tone: {
      default: "bg-muted-foreground-4",
      success: "bg-success",
      primary: "bg-primary",
    },
  },
  defaultVariants: { tone: "default" },
});

type ToastTone = NonNullable<VariantProps<typeof toastDotVariants>["tone"]>;

type ToastData = {
  tone?: ToastTone;
};

type ToastOptions = {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** One undo-style action; the toast closes once it is pressed. */
  action?: { label: string; onClick: () => void };
  /** Milliseconds before it dismisses itself; the provider's default otherwise. */
  timeout?: number;
};

/**
 * Wrap the app once; `useToast()` then works anywhere under it. `limit` keeps
 * a burst of confirmations from stacking past what a reader can follow.
 */
function ToastProvider({
  children,
  limit = 3,
  timeout = 5000,
}: {
  children: ReactNode;
  limit?: number;
  timeout?: number;
}) {
  return (
    <ToastPrimitive.Provider limit={limit} timeout={timeout}>
      {children}
    </ToastPrimitive.Provider>
  );
}

/**
 * A toast is a transient confirmation — « Dépense ajoutée », « Abonnement
 * résilié · Annuler ». Anything the user must still act on is an Alert.
 */
function useToast(): {
  add: (options: ToastOptions) => string;
  close: (id?: string) => void;
} {
  const manager = ToastPrimitive.useToastManager();

  return {
    add: ({ action, description, timeout, title, tone }) =>
      manager.add<ToastData>({
        actionProps:
          action === undefined
            ? undefined
            : { children: action.label, onClick: action.onClick },
        data: { tone },
        description,
        timeout,
        title,
      }),
    close: (id) => manager.close(id),
  };
}

/** Mount once, next to the provider's children; every toast renders here. */
function Toaster({
  className,
  closeLabel = "Close",
}: {
  className?: string;
  /** The close button's accessible name, in the user's language. */
  closeLabel?: string;
}) {
  const { toasts } = ToastPrimitive.useToastManager<ToastData>();

  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport
        data-slot="toaster"
        className={cn(
          "fixed bottom-4 left-4 z-60 flex w-[min(24rem,calc(100vw-2rem))] flex-col-reverse gap-2 outline-none",
          className,
        )}
      >
        {toasts.map((toast) => (
          <ToastPrimitive.Root
            data-slot="toast"
            className="flex items-start gap-2.5 rounded-md border border-border-4 bg-secondary-2 py-2.5 pr-2 pl-3.5 text-foreground-hi text-sm shadow-lg transition-[opacity,transform] duration-200 data-ending-style:translate-y-2 data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:opacity-0 data-[limited]:hidden"
            key={toast.id}
            swipeDirection={["down", "left"]}
            toast={toast}
          >
            <span
              aria-hidden
              className={toastDotVariants({ tone: toast.data?.tone })}
            />
            <ToastPrimitive.Content className="flex min-w-0 flex-1 flex-col gap-0.5 py-0.5">
              <ToastPrimitive.Title className="text-pretty" />
              <ToastPrimitive.Description className="text-muted-foreground-3 text-xs" />
            </ToastPrimitive.Content>
            {toast.actionProps !== undefined && (
              <ToastPrimitive.Action
                render={<Button size="sm" variant="link" />}
              />
            )}
            <ToastPrimitive.Close
              aria-label={closeLabel}
              render={<Button size="icon-sm" variant="ghost" />}
            >
              <XIcon aria-hidden />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  );
}

export { Toaster, type ToastOptions, ToastProvider, type ToastTone, useToast };
