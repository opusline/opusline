"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Button } from "@opusline/ui/components/button";

import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";
import type * as React from "react";

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-overlay duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

const dialogContentVariants = cva(
  "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-popover text-xs/relaxed text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
  {
    variants: {
      /** `lg` is the roomier anatomy of a flow dialog: a form or a step with copy. */
      size: {
        default: "gap-4 p-4 sm:max-w-sm",
        lg: "gap-5 p-6 sm:max-w-md",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function DialogContent({
  className,
  children,
  showCloseButton = true,
  size = "default",
  ...props
}: DialogPrimitive.Popup.Props &
  VariantProps<typeof dialogContentVariants> & {
    showCloseButton?: boolean;
  }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(dialogContentVariants({ size }), className)}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

const dialogFooterVariants = cva("flex gap-2", {
  variants: {
    /** `inline` keeps the actions on one row, primary first, the way a flow dialog reads. */
    layout: {
      default: "flex-col-reverse sm:flex-row sm:justify-end",
      inline: "flex-row items-center sm:justify-start",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

function DialogFooter({
  className,
  showCloseButton = false,
  layout = "default",
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof dialogFooterVariants> & {
    showCloseButton?: boolean;
  }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(dialogFooterVariants({ layout }), className)}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

const dialogTitleVariants = cva("font-heading", {
  variants: {
    size: {
      default: "text-sm font-medium",
      lg: "text-lg font-semibold text-foreground-hi",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

function DialogTitle({
  className,
  size = "default",
  ...props
}: DialogPrimitive.Title.Props & VariantProps<typeof dialogTitleVariants>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(dialogTitleVariants({ size, className }))}
      {...props}
    />
  );
}

const dialogDescriptionVariants = cva(
  "*:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
  {
    variants: {
      size: {
        default: "text-xs/relaxed text-muted-foreground",
        lg: "text-pretty text-muted-foreground-2 text-sm leading-relaxed",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function DialogDescription({
  className,
  size = "default",
  ...props
}: DialogPrimitive.Description.Props &
  VariantProps<typeof dialogDescriptionVariants>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(dialogDescriptionVariants({ size }), className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  dialogContentVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogTitleVariants,
};
