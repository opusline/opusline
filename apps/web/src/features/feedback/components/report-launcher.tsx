import type { OpenIssueData, ReportDraftData } from "@opusline/api-client";
import {
  continueReportConversationMutation,
  sendReportMutation,
} from "@opusline/api-client/react-query";
import { Button } from "@opusline/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@opusline/ui/components/popover";
import { useMutation } from "@tanstack/react-query";
import { MessageSquareWarning } from "lucide-react";
import { useState } from "react";

import {
  serverErrorMessage,
  serverFieldErrors,
  writeErrorBanner,
} from "@/lib/validation";
import { m } from "@/paraglide/messages.js";
import { ReportChat, type ReportTranscript } from "./report-chat";
import { type ReportContext, ReportForm } from "./report-form";

type ReportLauncherProps = {
  context: ReportContext;
  /** With the account's Anthropic key, Claude drafts the report first. */
  canDraftWithClaude: boolean;
};

/**
 * The corner button every signed-in screen carries: a bug report or an idea,
 * filed on the project's GitHub through the relay.
 */
export function ReportLauncher({
  context,
  canDraftWithClaude,
}: ReportLauncherProps) {
  const sendReport = useMutation(sendReportMutation());
  const converse = useMutation(continueReportConversationMutation());
  const [isChatting, setIsChatting] = useState(canDraftWithClaude);
  const [transcript, setTranscript] = useState<ReportTranscript>([]);
  const [draft, setDraft] = useState<ReportDraftData | null>(null);
  const [duplicates, setDuplicates] = useState<OpenIssueData[]>([]);

  const startOver = () => {
    sendReport.reset();
    converse.reset();
    setIsChatting(canDraftWithClaude);
    setTranscript([]);
    setDraft(null);
    setDuplicates([]);
  };

  const sendToClaude = async (text: string): Promise<boolean> => {
    const asked: ReportTranscript = [...transcript, { speaker: 0, text }];

    try {
      const turn = await converse.mutateAsync({ body: { messages: asked } });

      setTranscript([...asked, { speaker: 1, text: turn.reply }]);
      setDuplicates(turn.duplicates);

      if (turn.draft !== null) {
        setDraft(turn.draft);
        setIsChatting(false);
      }

      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-40">
      <Popover
        onOpenChange={(isOpen) => {
          if (!isOpen && sendReport.isSuccess) {
            startOver();
          }
        }}
      >
        <PopoverTrigger
          render={
            <Button
              aria-label={m.report_launcher_label()}
              data-testid="report-launcher"
              size="icon-xl"
              surface="raised"
              title={m.report_launcher_label()}
              variant="outline"
            />
          }
        >
          <MessageSquareWarning aria-hidden />
        </PopoverTrigger>
        <PopoverContent align="end" side="top" size="lg" surface="raised">
          <PopoverTitle className="mb-3">{m.report_heading()}</PopoverTitle>
          {isChatting ? (
            <ReportChat
              error={
                converse.error
                  ? serverErrorMessage(converse.error, m.report_chat_failed())
                  : null
              }
              isPending={converse.isPending}
              onSend={sendToClaude}
              onSkip={() => setIsChatting(false)}
              transcript={transcript}
            />
          ) : (
            <ReportForm
              context={context}
              draft={draft}
              duplicates={duplicates}
              error={writeErrorBanner(sendReport.error, m.report_failed())}
              filedIssue={sendReport.data ?? null}
              // A new draft starts a fresh form, not edits to the last one.
              key={draft?.title ?? "blank"}
              isPending={sendReport.isPending}
              onSendAnother={startOver}
              onSubmit={async (report) => {
                try {
                  await sendReport.mutateAsync({ body: report });
                  return null;
                } catch (error) {
                  return serverFieldErrors(error);
                }
              }}
            />
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
