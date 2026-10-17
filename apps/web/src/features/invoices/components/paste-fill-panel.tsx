import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { CopyButton } from "@opusline/ui/components/copy-button";
import { Panel } from "@opusline/ui/components/panel";
import { Textarea } from "@opusline/ui/components/textarea";
import { CircleAlert, ClipboardPaste, Sparkles } from "lucide-react";
import { useId, useState } from "react";

import { m } from "@/paraglide/messages.js";

import type { FilledField } from "../lib/paste-fill";

type PasteFillPanelProps = {
  /** The prompt the user hands an AI; copied as is. */
  prompt: string;
  /** A block in the format, to try the panel with. */
  sample: string;
  /** Applies the text to the draft and says what it filled; null when the text is not in the format. */
  onFill: (text: string) => FilledField[] | null;
};

type Outcome =
  | { status: "filled"; fields: FilledField[] }
  | { status: "unrecognized" };

function filledLabel(field: FilledField): string {
  switch (field.kind) {
    case "client":
      return m.paste_filled_client({ name: field.name });
    case "title":
      return m.paste_filled_title();
    case "description":
      return m.paste_filled_description();
    case "lines":
      return m.paste_filled_lines({ count: field.count });
    case "term":
      return m.paste_filled_term();
    case "validity":
      return m.paste_filled_validity({ days: field.days });
    case "deposit":
      return m.paste_filled_deposit({ rate: field.percent });
  }
}

/** « Remplir depuis un texte »: paste the tagged block an AI wrote, fill the editor from it. */
export function PasteFillPanel({
  prompt,
  sample,
  onFill,
}: PasteFillPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [isPromptShown, setIsPromptShown] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const textId = useId();

  const fill = () => {
    const fields = onFill(text);

    setOutcome(
      fields === null
        ? { status: "unrecognized" }
        : { status: "filled", fields },
    );
  };

  return (
    <Panel
      className="px-5 py-5 sm:px-7"
      data-testid="paste-fill"
      padding="none"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border bg-secondary text-foreground-4">
            <ClipboardPaste aria-hidden className="size-4" />
          </span>
          <div className="min-w-0">
            <h2 className="text-foreground-hi text-sm">{m.paste_title()}</h2>
            <p className="mt-0.5 text-muted-foreground-3 text-xs leading-relaxed">
              {m.paste_description()}
            </p>
          </div>
        </div>
        <Button
          aria-controls={textId}
          aria-expanded={isOpen}
          data-testid="paste-fill-toggle"
          onClick={() => setIsOpen((open) => !open)}
          size="sm"
          variant="outline"
        >
          {isOpen ? m.paste_toggle_close() : m.paste_toggle_open()}
        </Button>
      </div>

      {isOpen ? (
        <div className="mt-4 flex flex-col gap-3">
          <Textarea
            aria-label={m.paste_title()}
            className="font-mono text-xs"
            data-testid="paste-fill-text"
            id={textId}
            onChange={(event) => {
              setText(event.target.value);
              setOutcome(null);
            }}
            placeholder={m.paste_placeholder()}
            rows={7}
            value={text}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              data-testid="paste-fill-apply"
              disabled={text.trim() === ""}
              onClick={fill}
              size="lg"
            >
              <Sparkles data-icon="inline-start" />
              {m.paste_fill()}
            </Button>
            <CopyButton
              copiedLabel={m.common_copied()}
              data-testid="paste-fill-copy"
              failedLabel={m.common_copy_failed()}
              label={m.paste_copy_prompt()}
              value={prompt}
            />
            <Button
              aria-expanded={isPromptShown}
              data-testid="paste-fill-prompt-toggle"
              onClick={() => setIsPromptShown((shown) => !shown)}
              size="lg"
              variant="ghost"
            >
              {isPromptShown ? m.paste_hide_prompt() : m.paste_show_prompt()}
            </Button>
            <Button
              data-testid="paste-fill-sample"
              onClick={() => {
                setText(sample);
                setOutcome(null);
              }}
              size="lg"
              variant="ghost"
            >
              {m.paste_sample()}
            </Button>
          </div>
          <p className="text-muted-foreground-3 text-xs leading-relaxed">
            {m.paste_hint()}
          </p>
          {isPromptShown ? (
            <pre
              className="max-h-80 overflow-auto whitespace-pre-wrap rounded-md border bg-muted px-3 py-2.5 font-mono text-foreground-4 text-xs leading-relaxed"
              data-testid="paste-fill-prompt"
            >
              {prompt}
            </pre>
          ) : null}
          {outcome?.status === "unrecognized" ? (
            <Alert data-testid="paste-fill-unrecognized" variant="warn">
              <CircleAlert />
              <AlertDescription>{m.paste_unrecognized()}</AlertDescription>
            </Alert>
          ) : null}
          {outcome?.status === "filled" ? (
            <p
              className="flex flex-wrap items-center gap-1.5 text-muted-foreground-3 text-xs"
              data-count={outcome.fields.length}
              data-testid="paste-fill-filled"
            >
              <span>{m.paste_filled_prefix()}</span>
              {outcome.fields.map((field) => (
                <Badge
                  data-kind={field.kind}
                  data-testid="paste-fill-chip"
                  key={field.kind}
                  variant="success"
                >
                  {filledLabel(field)}
                </Badge>
              ))}
              <span>{m.paste_filled_suffix()}</span>
            </p>
          ) : null}
        </div>
      ) : null}
    </Panel>
  );
}
