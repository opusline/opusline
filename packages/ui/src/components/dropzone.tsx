import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, useState } from "react";

const dropzoneVariants = cva(
  [
    "relative cursor-pointer border border-dashed transition-colors",
    "has-[input:focus-visible]:border-primary has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-primary/25",
    "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-60",
    "data-drag-over:border-primary/80 data-drag-over:bg-primary/8 data-drag-over:text-primary-text",
  ],
  {
    variants: {
      size: {
        /** A link-sized affordance inside a table cell or a rail card. */
        inline:
          "inline-flex h-7.5 items-center gap-1.5 rounded-md px-2.25 text-xs whitespace-nowrap [&_svg:not([class*='size-'])]:size-3",
        /** A form field: one line with an icon and a hint. */
        default:
          "flex h-13 items-center gap-2.5 rounded-md px-3.5 text-sm [&_svg:not([class*='size-'])]:size-4",
        /** The empty state of a panel: icon above, hint and caption below. */
        lg: "flex flex-col items-center justify-center gap-2.5 rounded-md px-4 py-6.5 text-center text-sm [&_svg:not([class*='size-'])]:size-5.5",
      },
      tone: {
        default:
          "border-border-4 bg-muted text-foreground-3 hover:border-muted-foreground-5",
        /** Something is missing here: the receipt a row still waits for. */
        attention:
          "border-attention/55 bg-transparent text-attention hover:border-attention",
        /** The main affordance of a panel, in the brand colour. */
        brand:
          "border-primary/45 bg-muted text-foreground-hi hover:border-primary/80 [&_svg]:text-primary-text",
      },
    },
    defaultVariants: { size: "default", tone: "default" },
  },
);

type DropzoneProps = Omit<ComponentProps<"label">, "onChange"> &
  VariantProps<typeof dropzoneVariants> & {
    /** Comma-separated extensions, `.pdf,.jpg` — the browser's file filter. */
    accept: string;
    /** Names the hidden input for assistive tech; the visible children are decoration to it. */
    "aria-label": string;
    disabled?: boolean;
    multiple?: boolean;
    /** Every drop or pick, as the browser hands it over. Filtering is the caller's. */
    onFiles: (files: FileList) => void;
  };

/**
 * A file target that is both a drop zone and a click target: a `<label>` over
 * a visually hidden `<input type="file">`, so keyboard users tab to it, the
 * ring shows on the label, and the same handler serves drop and pick.
 */
function Dropzone({
  accept,
  "aria-label": ariaLabel,
  children,
  className,
  disabled = false,
  multiple = false,
  onFiles,
  size,
  tone,
  ...props
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <label
      data-slot="dropzone"
      data-drag-over={isDragOver && !disabled ? "" : undefined}
      className={cn(dropzoneVariants({ size, tone }), className)}
      onDragLeave={() => setIsDragOver(false)}
      onDragOver={(event) => {
        if (disabled) {
          return;
        }

        event.preventDefault();
        setIsDragOver(true);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragOver(false);

        if (!disabled && event.dataTransfer.files.length > 0) {
          onFiles(event.dataTransfer.files);
        }
      }}
      {...props}
    >
      <input
        accept={accept}
        aria-label={ariaLabel}
        className="sr-only"
        disabled={disabled}
        multiple={multiple}
        onChange={(event) => {
          if (event.target.files !== null && event.target.files.length > 0) {
            onFiles(event.target.files);
          }

          // Picking the same file twice must fire again.
          event.target.value = "";
        }}
        type="file"
      />
      {children}
    </label>
  );
}

export { Dropzone, dropzoneVariants };
