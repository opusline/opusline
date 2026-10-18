import type { ReportConversationData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Label } from "@opusline/ui/components/label";
import { Textarea } from "@opusline/ui/components/textarea";
import { CircleAlert, LoaderCircleIcon } from "lucide-react";
import { useId, useState } from "react";

import { m } from "@/paraglide/messages.js";

export type ReportTranscript = ReportConversationData["messages"];

/** The API keeps at most twenty lines; past that, the form takes over. */
const MAX_LINES = 20;

type ReportChatProps = {
  transcript: ReportTranscript;
  isPending: boolean;
  error: string | null;
  onSend: (text: string) => Promise<boolean>;
  onSkip: () => void;
};

/**
 * Claude asks what a maintainer would need, one question at a time, until it
 * can draft the report; the account can leave for the plain form at any point.
 */
export function ReportChat({
  transcript,
  isPending,
  error,
  onSend,
  onSkip,
}: ReportChatProps) {
  const inputId = useId();
  const [draft, setDraft] = useState("");
  const canSend = transcript.length < MAX_LINES - 1;

  const send = async () => {
    const text = draft.trim();

    if (text === "" || isPending) {
      return;
    }

    if (await onSend(text)) {
      setDraft("");
    }
  };

  return (
    <div className="flex flex-col gap-3" data-testid="report-chat">
      {transcript.length === 0 ? (
        <p className="text-muted-foreground-3 text-sm">
          {m.report_chat_intro()}
        </p>
      ) : (
        <ol
          aria-live="polite"
          className="flex max-h-64 flex-col gap-2 overflow-y-auto"
        >
          {transcript.map((line, index) => (
            <li
              className={
                line.speaker === 0
                  ? "self-end rounded-md bg-muted px-3 py-2 text-sm"
                  : "self-start rounded-md border px-3 py-2 text-sm"
              }
              data-speaker={line.speaker}
              data-testid="report-chat-line"
              // biome-ignore lint/suspicious/noArrayIndexKey: lines carry no id, and the transcript only ever grows, so a line keeps its index
              key={index}
            >
              <span className="sr-only">
                {line.speaker === 0 ? m.report_chat_you() : "Claude"}:{" "}
              </span>
              <span className="whitespace-pre-wrap">{line.text}</span>
            </li>
          ))}
        </ol>
      )}
      {isPending ? (
        <div className="flex items-center gap-2 text-muted-foreground-3 text-xs">
          <LoaderCircleIcon aria-hidden className="size-3.5 animate-spin" />
          {m.report_chat_thinking()}
        </div>
      ) : null}
      {error === null ? null : (
        <Alert variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {canSend ? (
        <form
          className="flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <Label className="sr-only" htmlFor={inputId}>
            {m.report_chat_label()}
          </Label>
          <Textarea
            data-testid="report-chat-input"
            id={inputId}
            maxLength={4000}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send();
              }
            }}
            placeholder={m.report_chat_placeholder()}
            rows={3}
            value={draft}
          />
          <Button
            data-testid="report-chat-send"
            disabled={isPending || draft.trim() === ""}
            type="submit"
          >
            {m.report_chat_send()}
          </Button>
        </form>
      ) : null}
      <Button
        data-testid="report-chat-skip"
        onClick={onSkip}
        type="button"
        variant="ghost"
      >
        {m.report_chat_skip()}
      </Button>
    </div>
  );
}
