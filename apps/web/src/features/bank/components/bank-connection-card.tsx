import type { BankAccountData, BankConnectionData } from "@opusline/api-client";
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
import { Panel } from "@opusline/ui/components/panel";
import {
  StatusRow,
  StatusRowActions,
  StatusRowContent,
  StatusRowDescription,
  StatusRowMedia,
  StatusRowTitle,
} from "@opusline/ui/components/status-row";
import { Link } from "@tanstack/react-router";
import { Landmark, RefreshCwIcon } from "lucide-react";

import { useLocale } from "@/components/money-format-provider";
import { fullDateLabel, fullDateTimeLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";
import {
  bankAccountLabel,
  bankSyncErrorLabel,
  type ConnectionState,
  connectionState,
  consentExpiresSoon,
} from "../lib/connection";

type BankConnectionCardProps = {
  data: Pick<BankAccountData, "bankSyncConfigured" | "connection">;
  isSyncing: boolean;
  isDisconnecting: boolean;
  onConnect: () => void;
  onChooseAccount: () => void;
  onSync: () => void;
  onDisconnect: () => void;
};

/** Where the bank sync stands, and the one step it asks for next. */
export function BankConnectionCard({
  data,
  isSyncing,
  isDisconnecting,
  onConnect,
  onChooseAccount,
  onSync,
  onDisconnect,
}: BankConnectionCardProps) {
  const state = connectionState(data);
  const connection = data.connection;
  const isExpiringSoon =
    connection !== null &&
    state === "active" &&
    consentExpiresSoon(connection.validUntil);

  return (
    <Panel data-status={state} data-testid="bank-connection-card">
      <StatusRow surface="plain">
        <StatusRowMedia>
          <Landmark aria-hidden />
        </StatusRowMedia>
        <StatusRowContent>
          <StatusRowTitle>
            {connection === null
              ? m.bank_connection_title()
              : connectionTitle(connection)}
            <StateBadge state={state} />
          </StatusRowTitle>
          <ConnectionDescription
            connection={connection}
            isExpiringSoon={isExpiringSoon}
            state={state}
          />
        </StatusRowContent>
        <StatusRowActions>
          {state === "unconfigured" && (
            <Button
              data-testid="bank-connection-setup"
              render={<Link search={{ tab: "integrations" }} to="/settings" />}
              size="lg"
              variant="secondary"
            >
              {m.bank_connection_setup()}
            </Button>
          )}
          {state === "disconnected" && (
            <Button
              data-testid="bank-connect-open"
              onClick={onConnect}
              size="lg"
            >
              {m.bank_connection_connect()}
            </Button>
          )}
          {state === "awaiting-account" && (
            <Button
              data-testid="bank-account-choose-open"
              onClick={onChooseAccount}
              size="lg"
            >
              {m.bank_connection_choose_account()}
            </Button>
          )}
          {state === "active" && (
            <Button
              data-testid="bank-sync"
              disabled={isSyncing}
              onClick={onSync}
              size="lg"
              variant="secondary"
            >
              <RefreshCwIcon
                aria-hidden
                className={isSyncing ? "animate-spin" : undefined}
                data-icon="inline-start"
              />
              {m.bank_connection_sync()}
            </Button>
          )}
          {(state === "expired" || isExpiringSoon) && (
            <Button data-testid="bank-reconnect" onClick={onConnect} size="lg">
              {m.bank_connection_reconnect()}
            </Button>
          )}
          {connection !== null && (
            <DisconnectButton
              isDisconnecting={isDisconnecting}
              onDisconnect={onDisconnect}
            />
          )}
        </StatusRowActions>
      </StatusRow>
    </Panel>
  );
}

function connectionTitle(connection: BankConnectionData): string {
  return connection.account === null
    ? connection.aspspName
    : `${connection.aspspName} · ${bankAccountLabel(connection.account)}`;
}

function StateBadge({ state }: { state: ConnectionState }) {
  switch (state) {
    case "active":
      return (
        <Badge variant="success">{m.bank_connection_badge_active()}</Badge>
      );
    case "awaiting-account":
      return (
        <Badge variant="attention">{m.bank_connection_badge_awaiting()}</Badge>
      );
    case "expired":
      return <Badge variant="warn">{m.bank_connection_badge_expired()}</Badge>;
    default:
      return null;
  }
}

function ConnectionDescription({
  connection,
  isExpiringSoon,
  state,
}: {
  connection: BankConnectionData | null;
  isExpiringSoon: boolean;
  state: ConnectionState;
}) {
  const locale = useLocale();

  if (connection === null) {
    return (
      <StatusRowDescription>
        {state === "unconfigured"
          ? m.bank_connection_unconfigured()
          : m.bank_connection_disconnected()}
      </StatusRowDescription>
    );
  }

  if (state === "awaiting-account") {
    return (
      <StatusRowDescription>
        {m.bank_connection_awaiting_account()}
      </StatusRowDescription>
    );
  }

  if (state === "expired") {
    return (
      <StatusRowDescription>{m.bank_connection_expired()}</StatusRowDescription>
    );
  }

  const validUntil = fullDateLabel(locale, connection.validUntil);

  return (
    <>
      <StatusRowDescription>
        {connection.lastSyncedAt === null
          ? m.bank_connection_unsynced_until({ until: validUntil })
          : m.bank_connection_synced_until({
              synced: fullDateTimeLabel(locale, connection.lastSyncedAt),
              until: validUntil,
            })}
      </StatusRowDescription>
      {isExpiringSoon && (
        <StatusRowDescription tone="attention">
          {m.bank_connection_expires_soon({ date: validUntil })}
        </StatusRowDescription>
      )}
      {connection.lastError !== null && (
        <StatusRowDescription data-testid="bank-sync-error" tone="destructive">
          {bankSyncErrorLabel(connection.lastError)}
        </StatusRowDescription>
      )}
    </>
  );
}

function DisconnectButton({
  isDisconnecting,
  onDisconnect,
}: {
  isDisconnecting: boolean;
  onDisconnect: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            data-testid="bank-disconnect"
            disabled={isDisconnecting}
            size="lg"
            variant="ghost"
          />
        }
      >
        {m.bank_connection_disconnect()}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {m.bank_connection_disconnect_confirm_title()}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {m.bank_connection_disconnect_confirm_body()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{m.common_cancel()}</AlertDialogCancel>
          <AlertDialogAction
            data-testid="bank-disconnect-confirm"
            onClick={onDisconnect}
            render={<Button size="2xl" variant="destructive" />}
          >
            {m.bank_connection_disconnect()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
