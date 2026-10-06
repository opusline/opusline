import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { TextLink } from "@opusline/ui/components/text-link";
import { CircleAlert, CircleCheck, ExternalLink, Info } from "lucide-react";

import { m } from "@/paraglide/messages.js";
import { SettingsSection } from "./settings-section";

const MAIL_SETUP_GUIDE =
  "https://github.com/opusline/opusline/blob/main/docs/self-hosting.md#choices-you-can-change";

type MailDeliveryCardProps = {
  /** False on an instance whose operator named no mailer. */
  isMailEnabled: boolean;
  /** Where the test goes: only ever the address the account signs in with. */
  email: string;
  isSending: boolean;
  isSent: boolean;
  error: string | null;
  onSendTest: () => void;
};

export function MailDeliveryCard({
  isMailEnabled,
  email,
  isSending,
  isSent,
  error,
  onSendTest,
}: MailDeliveryCardProps) {
  return (
    <SettingsSection
      description={m.mail_delivery_description()}
      title={m.mail_delivery_title()}
    >
      <div className="flex flex-col items-start gap-3.5">
        {isMailEnabled ? (
          <>
            <p className="text-muted-foreground-2 text-xs">
              {m.mail_delivery_test_hint({ email })}
            </p>
            <Button
              data-testid="mail-delivery-send-test"
              disabled={isSending}
              onClick={onSendTest}
              variant="outline"
            >
              {m.mail_delivery_test_button()}
            </Button>
            {error === null ? null : (
              <Alert data-testid="mail-delivery-test-failed" variant="warn">
                <CircleAlert />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {isSent ? (
              <Alert data-testid="mail-delivery-test-sent" variant="success">
                <CircleCheck />
                <AlertDescription>
                  {m.mail_delivery_test_sent()}
                </AlertDescription>
              </Alert>
            ) : null}
          </>
        ) : (
          <>
            <Alert data-testid="mail-delivery-not-configured" variant="brand">
              <Info />
              <AlertDescription>
                {m.mail_delivery_not_configured()}
              </AlertDescription>
            </Alert>
            <TextLink
              className="inline-flex items-center gap-1.5"
              href={MAIL_SETUP_GUIDE}
              rel="noreferrer"
              size="sm"
              target="_blank"
              underline="hover"
            >
              {m.mail_delivery_setup_guide()}
              <ExternalLink aria-hidden className="size-3.5" />
            </TextLink>
          </>
        )}
      </div>
    </SettingsSection>
  );
}
