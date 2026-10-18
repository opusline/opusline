import { sendReportMutation } from "@opusline/api-client/react-query";
import { Button } from "@opusline/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@opusline/ui/components/popover";
import { useMutation } from "@tanstack/react-query";
import { MessageSquareWarning } from "lucide-react";

import { serverFieldErrors, writeErrorBanner } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";
import { type ReportContext, ReportForm } from "./report-form";

type ReportLauncherProps = {
  context: ReportContext;
};

/**
 * The corner button every signed-in screen carries: a bug report or an idea,
 * filed on the project's GitHub through the relay.
 */
export function ReportLauncher({ context }: ReportLauncherProps) {
  const sendReport = useMutation(sendReportMutation());

  return (
    <div className="fixed right-4 bottom-4 z-40">
      <Popover
        onOpenChange={(isOpen) => {
          if (!isOpen && sendReport.isSuccess) {
            sendReport.reset();
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
          <ReportForm
            context={context}
            error={writeErrorBanner(sendReport.error, m.report_failed())}
            filedIssue={sendReport.data ?? null}
            isPending={sendReport.isPending}
            onSendAnother={() => sendReport.reset()}
            onSubmit={async (report) => {
              try {
                await sendReport.mutateAsync({ body: report });
                return null;
              } catch (error) {
                return serverFieldErrors(error);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
