import type { Locale, TrustedDeviceData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@opusline/ui/components/alert-dialog";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@opusline/ui/components/empty";
import {
  StatusRow,
  StatusRowActions,
  StatusRowContent,
  StatusRowDescription,
  StatusRowMedia,
  StatusRowTitle,
} from "@opusline/ui/components/status-row";
import { CircleAlert, Laptop } from "lucide-react";

import { fullDateLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";
import { SettingsSection } from "./settings-section";

type TrustedBrowsersCardProps = {
  devices: TrustedDeviceData[];
  locale: Locale;
  isPending: boolean;
  error: string | null;
  onRevoke: (id: number) => void;
  onRevokeAll: () => void;
};

export function trustedDeviceLabel(device: TrustedDeviceData): string {
  return m.security_trusted_label({
    browser: device.browser ?? m.security_trusted_unknown_browser(),
    platform: device.platform ?? m.security_trusted_unknown_platform(),
  });
}

export function TrustedBrowsersCard({
  devices,
  locale,
  isPending,
  error,
  onRevoke,
  onRevokeAll,
}: TrustedBrowsersCardProps) {
  return (
    <SettingsSection
      description={m.security_trusted_description()}
      title={m.security_trusted_title()}
    >
      {error === null ? null : (
        <Alert className="mb-3.5" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {devices.length === 0 ? (
        <Empty surface="dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Laptop />
            </EmptyMedia>
            <EmptyDescription>{m.security_trusted_empty()}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="divide-y rounded-md border">
          {devices.map((device) => (
            <StatusRow key={device.id} surface="plain">
              <StatusRowMedia>
                <Laptop />
              </StatusRowMedia>
              <StatusRowContent>
                <StatusRowTitle>
                  {trustedDeviceLabel(device)}
                  {device.current ? (
                    <Badge variant="brand">
                      {m.security_trusted_current()}
                    </Badge>
                  ) : null}
                </StatusRowTitle>
                <StatusRowDescription>
                  {device.lastUsedAt === null
                    ? m.security_trusted_never_used()
                    : m.security_trusted_last_used({
                        date: fullDateLabel(locale, device.lastUsedAt),
                      })}
                </StatusRowDescription>
              </StatusRowContent>
              <StatusRowActions>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        disabled={isPending}
                        size="lg"
                        variant="outline"
                      />
                    }
                  >
                    {m.security_trusted_revoke()}
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {m.security_trusted_revoke_confirm_title()}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {device.current
                          ? m.security_trusted_revoke_current_confirm_body()
                          : m.security_trusted_revoke_confirm_body()}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{m.common_cancel()}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onRevoke(device.id)}>
                        {m.security_trusted_revoke()}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </StatusRowActions>
            </StatusRow>
          ))}
        </div>
      )}

      {devices.length > 1 ? (
        <div className="mt-3.5">
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button disabled={isPending} size="lg" variant="ghost" />}
            >
              {m.security_trusted_revoke_all()}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {m.security_trusted_revoke_all_confirm_title()}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {m.security_trusted_revoke_all_confirm_body()}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{m.common_cancel()}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onRevokeAll}
                  render={<Button size="2xl" variant="destructive" />}
                >
                  {m.security_trusted_revoke_all()}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : null}
    </SettingsSection>
  );
}
