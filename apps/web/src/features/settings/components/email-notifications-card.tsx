import type { NotificationPreferencesData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Switch } from "@opusline/ui/components/switch";
import { CircleAlert } from "lucide-react";

import { m } from "@/paraglide/messages.js";
import { SettingsSection } from "./settings-section";

type PreferenceRowProps = {
  testId: string;
  label: string;
  hint: string;
  isEnabled: boolean;
  isDisabled: boolean;
  onChange: (isEnabled: boolean) => void;
};

function PreferenceRow({
  testId,
  label,
  hint,
  isEnabled,
  isDisabled,
  onChange,
}: PreferenceRowProps) {
  return (
    <div className="flex items-start justify-between gap-5">
      <div>
        <div className="mb-1 text-foreground-3 text-sm">{label}</div>
        <div className="text-muted-foreground-2 text-xs">{hint}</div>
      </div>
      <Switch
        aria-label={label}
        checked={isEnabled}
        data-enabled={isEnabled}
        data-testid={testId}
        disabled={isDisabled}
        onCheckedChange={onChange}
      />
    </div>
  );
}

type EmailNotificationsCardProps = {
  preferences: NotificationPreferencesData;
  isSaving: boolean;
  error: string | null;
  onChange: (preferences: NotificationPreferencesData) => void;
};

export function EmailNotificationsCard({
  preferences,
  isSaving,
  error,
  onChange,
}: EmailNotificationsCardProps) {
  return (
    <SettingsSection
      description={m.notifications_email_description()}
      title={m.notifications_email_title()}
    >
      {error === null ? null : (
        <Alert className="mb-5" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-5">
        <PreferenceRow
          hint={m.notifications_security_alerts_hint()}
          isDisabled={isSaving}
          isEnabled={preferences.securityAlerts}
          label={m.notifications_security_alerts_label()}
          onChange={(securityAlerts) =>
            onChange({ ...preferences, securityAlerts })
          }
          testId="notifications-security-alerts"
        />
        <div className="h-px bg-secondary" />
        <PreferenceRow
          hint={m.notifications_deadline_reminders_hint()}
          isDisabled={isSaving}
          isEnabled={preferences.deadlineReminders}
          label={m.notifications_deadline_reminders_label()}
          onChange={(deadlineReminders) =>
            onChange({ ...preferences, deadlineReminders })
          }
          testId="notifications-deadline-reminders"
        />
      </div>
    </SettingsSection>
  );
}
