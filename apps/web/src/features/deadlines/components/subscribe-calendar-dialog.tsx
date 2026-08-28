import type { CalendarFeedData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { Checkbox } from "@opusline/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import {
  InputGroup,
  InputGroupInput,
} from "@opusline/ui/components/input-group";
import { Label } from "@opusline/ui/components/label";
import { Separator } from "@opusline/ui/components/separator";
import { cn } from "@opusline/ui/lib/utils";
import { RefreshCwIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { calendarDateLabel } from "@/lib/dates";
import { calendarFeedHref, calendarSyncLabel } from "@/lib/deadlines";
import { m } from "@/paraglide/messages.js";

type FeedToggle = {
  key: keyof CalendarFeedData;
  label: () => string;
  description: () => string;
};

const FEED_TOGGLES: FeedToggle[] = [
  {
    key: "invoices",
    label: m.deadlines_feed_invoices_label,
    description: m.deadlines_feed_invoices_desc,
  },
  {
    key: "reminders",
    label: m.deadlines_feed_reminders_label,
    description: m.deadlines_feed_reminders_desc,
  },
  {
    key: "vat",
    label: m.deadlines_feed_vat_label,
    description: m.deadlines_feed_vat_desc,
  },
  {
    key: "urssaf",
    label: m.deadlines_feed_urssaf_label,
    description: m.deadlines_feed_urssaf_desc,
  },
  {
    key: "other",
    label: m.deadlines_feed_other_label,
    description: m.deadlines_feed_other_desc,
  },
];

type SubscribeCalendarDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendarToken: string;
  feed: CalendarFeedData;
  /** The day the user said the address was added; null flips the dialog to the subscribe flavor. */
  subscribedOn: string | null;
  /** ISO instant of the feed's last fetch; null while no calendar has come yet. */
  lastSyncedAt: string | null;
  isSaving: boolean;
  onSave: (feed: CalendarFeedData) => void;
  isRotating: boolean;
  onRotate: () => void;
  isInterrupting: boolean;
  onInterrupt: () => void;
};

export function SubscribeCalendarDialog({
  open,
  onOpenChange,
  calendarToken,
  feed,
  subscribedOn,
  lastSyncedAt,
  isSaving,
  onSave,
  isRotating,
  onRotate,
  isInterrupting,
  onInterrupt,
}: SubscribeCalendarDialogProps) {
  const addressId = useId();
  const format = useMoneyFormat();
  const isSubscribed = subscribedOn !== null;

  // The checkboxes edit a draft the primary button commits — « Enregistrer »
  // and « J'ai ajouté l'adresse » both read as commitments, so they are ones.
  const [draft, setDraft] = useState(feed);

  useEffect(() => {
    if (open) {
      setDraft(feed);
    }
  }, [open, feed]);
  const webcalUrl = calendarFeedHref(calendarToken).replace(
    /^https?:/,
    "webcal:",
  );
  // Stamped with the address it is about, so rotating one clears the notice by
  // derivation rather than by an effect chasing the prop.
  const [copyAttempt, setCopyAttempt] = useState<{
    url: string;
    outcome: "copied" | "failed";
  } | null>(null);
  const copyState =
    copyAttempt?.url === webcalUrl ? copyAttempt.outcome : "idle";

  const copy = () => {
    // Rejects whenever the document is not focused or the page is not a secure
    // context — a self-hosted install over plain http hits exactly that.
    navigator.clipboard
      ?.writeText(webcalUrl)
      .then(() => setCopyAttempt({ url: webcalUrl, outcome: "copied" }))
      .catch(() => setCopyAttempt({ url: webcalUrl, outcome: "failed" }));
  };

  const enabledCount = FEED_TOGGLES.filter(({ key }) => draft[key]).length;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="gap-5 p-6 sm:max-w-xl">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-xl">
            {isSubscribed
              ? m.deadlines_dialog_title_subscribed()
              : m.deadlines_dialog_title()}
          </DialogTitle>
          <DialogDescription className="text-pretty text-muted-foreground-2 text-sm leading-relaxed">
            {isSubscribed
              ? m.deadlines_dialog_intro_subscribed()
              : m.deadlines_dialog_intro()}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground text-sm" htmlFor={addressId}>
            {m.deadlines_dialog_address_label()}
          </Label>
          {/* One bordered row holding the address and its copy button, the way
              the design draws it. A read-only input, not a text block: an
              input's intrinsic width ignores its value, so the long address
              cannot widen the dialog the way an unbreakable string would. */}
          <InputGroup className="h-11 gap-2 bg-muted pr-1.5">
            <InputGroupInput
              className="flex-1 text-sm"
              id={addressId}
              onFocus={(event) => event.currentTarget.select()}
              readOnly
              value={webcalUrl}
            />
            <Button
              className="shrink-0"
              onClick={copy}
              size="lg"
              variant="outline"
            >
              {m.deadlines_calendar_copy()}
            </Button>
          </InputGroup>
          <p
            aria-live="polite"
            className={
              copyState === "idle"
                ? "text-muted-foreground-3 text-sm leading-relaxed"
                : copyState === "copied"
                  ? "text-primary-text text-sm"
                  : "text-destructive text-sm"
            }
          >
            {copyState === "copied"
              ? m.deadlines_calendar_copied()
              : copyState === "failed"
                ? m.deadlines_calendar_copy_failed()
                : m.deadlines_dialog_password_warning()}
          </p>
        </div>

        <Separator />

        <fieldset className="flex flex-col gap-4">
          <legend className={cn("mb-2", eyebrowVariants())}>
            {m.deadlines_dialog_receives_title()}
          </legend>
          {FEED_TOGGLES.map(({ key, label, description }) => (
            <FeedToggleRow
              checked={draft[key]}
              description={description()}
              disabled={isSaving}
              key={key}
              label={label()}
              onCheckedChange={(checked) =>
                setDraft({ ...draft, [key]: checked })
              }
            />
          ))}
          <p className="text-muted-foreground-3 text-sm">
            {m.deadlines_feed_types_count({ count: enabledCount })}
          </p>
        </fieldset>

        {isSubscribed && (
          <div className="flex items-center gap-2.5 rounded-md border px-4 py-3 text-muted-foreground-2 text-sm">
            <RefreshCwIcon aria-hidden className="size-4 shrink-0" />
            <span>
              {calendarSyncLabel(lastSyncedAt)}
              {" · "}
              {m.deadlines_sync_added({
                date: calendarDateLabel(format.locale, subscribedOn),
              })}
            </span>
          </div>
        )}

        {/* The design's order: act, refine, leave — primary first, the exit far right. */}
        <DialogFooter className="flex-row items-center gap-2 sm:justify-start">
          <Button disabled={isSaving} onClick={() => onSave(draft)} size="2xl">
            {isSubscribed ? m.common_save() : m.deadlines_dialog_added()}
          </Button>
          <Button
            disabled={isRotating}
            onClick={onRotate}
            size="2xl"
            variant="outline"
          >
            {m.deadlines_calendar_rotate()}
          </Button>
          {isSubscribed ? (
            <Button
              className="ml-auto text-destructive hover:text-destructive-strong"
              disabled={isInterrupting}
              onClick={onInterrupt}
              size="2xl"
              variant="ghost"
            >
              {m.deadlines_interrupt()}
            </Button>
          ) : (
            <Button
              className="ml-auto"
              onClick={() => onOpenChange(false)}
              size="2xl"
              variant="ghost"
            >
              {m.common_cancel()}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FeedToggleRow({
  checked,
  disabled,
  label,
  description,
  onCheckedChange,
}: {
  checked: boolean;
  disabled: boolean;
  label: string;
  description: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  const id = useId();

  return (
    <div className="flex items-start gap-3">
      <Checkbox
        checked={checked}
        className="mt-1"
        disabled={disabled}
        id={id}
        onCheckedChange={(state) => onCheckedChange(state === true)}
      />
      <div className="min-w-0">
        <Label className="text-base text-foreground-hi" htmlFor={id}>
          {label}
        </Label>
        <p className="mt-1 text-muted-foreground-3 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
