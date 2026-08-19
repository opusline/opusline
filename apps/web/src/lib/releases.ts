import { m } from "@/paraglide/messages.js";

import { isReleaseUnread, type ReleaseType } from "./semver";

export type ReleaseItemKind = "new" | "improved" | "fixed";

export type Release = {
  version: string;
  date: string;
  headline?: string;
  items: { kind: ReleaseItemKind; text: string }[];
};

export const RELEASES: Release[] = [
  // release-notes:insert
  {
    version: "0.14.0",
    date: "2026-08-19",
    items: [
      {
        kind: "new",
        text: "Clients you do not charge VAT — abroad, or under reverse charge — can now be set to their own rate, which every new invoice for them starts on and you can still change invoice by invoice.",
      },
      {
        kind: "new",
        text: 'Week view: tracked time still waiting on an invoice now wears a ring, and a "Current month" tile tracks the days you have worked against the month\'s business days.',
      },
    ],
  },
  {
    version: "0.13.0",
    date: "2026-08-17",
    items: [
      {
        kind: "new",
        text: "Client and mission pages now show real figures: revenue for the year, what is still outstanding, your average payment delay, and each mission's monthly and cumulative revenue.",
      },
      {
        kind: "new",
        text: "A mission's page now lists the time tracked on it, each entry showing the quantity it bills — days on a daily mission, hours on an hourly one — and whether it is still to invoice or already covered by one. The month's tracked total appears on the mission header and beside every mission of a client.",
      },
      {
        kind: "new",
        text: "The week view now totals what the week is worth: billable time valued at each mission's rate, with the non-billable and forfait time it left out named underneath.",
      },
    ],
  },
  {
    version: "0.12.0",
    date: "2026-08-16",
    items: [
      {
        kind: "new",
        text: "Business account: import your bank statements (CSV, OFX, QIF or CAMT) to follow your balance and movements, reconcile incoming payments with invoices in one click, and see how much to set aside for VAT, URSSAF and your safety buffer.",
      },
      {
        kind: "new",
        text: "Revenue dashboard: invoiced or collected CA by month, quarter or year, with VAT collected, estimated net after URSSAF, and a breakdown by client.",
      },
    ],
  },
  {
    version: "0.11.0",
    date: "2026-08-15",
    items: [
      {
        kind: "new",
        text: "Release notes inside the app: the sidebar shows your installed version and flags unread notes; a dedicated page lists what changed in each release.",
      },
    ],
  },
  {
    version: "0.10.0",
    date: "2026-08-15",
    headline:
      "Opusline now speaks English and French. The whole interface, including error messages coming from the API, follows the language set in your profile.",
    items: [
      {
        kind: "new",
        text: "The interface is available in English and French, driven by the language in your settings.",
      },
      {
        kind: "new",
        text: "Validation and error messages from the API arrive in your language too.",
      },
    ],
  },
  {
    version: "0.9.1",
    date: "2026-08-14",
    items: [
      {
        kind: "fixed",
        text: "Robustness fixes across the app following a code audit.",
      },
    ],
  },
  {
    version: "0.9.0",
    date: "2026-08-14",
    items: [
      {
        kind: "new",
        text: "Multi-currency support: pick your account currency and every rate, total and invoice follows it.",
      },
    ],
  },
  {
    version: "0.8.0",
    date: "2026-08-13",
    items: [
      {
        kind: "new",
        text: "CRA workflow: prepare, send and track your monthly activity report without leaving the app.",
      },
      {
        kind: "improved",
        text: "Refreshed CRA interface.",
      },
    ],
  },
];

export function unreadReleaseCount(seenVersion: string | null): number {
  return RELEASES.filter((release) =>
    isReleaseUnread(release.version, seenVersion),
  ).length;
}

const RELEASE_KIND_MESSAGES: Record<ReleaseItemKind, () => string> = {
  new: m.release_notes_kind_new,
  improved: m.release_notes_kind_improved,
  fixed: m.release_notes_kind_fixed,
};

export function releaseKindLabel(kind: ReleaseItemKind): string {
  return RELEASE_KIND_MESSAGES[kind]();
}

export const RELEASE_KIND_CLASSES: Record<ReleaseItemKind, string> = {
  new: "text-primary-text",
  improved: "text-muted-foreground",
  fixed: "text-success",
};

const RELEASE_TYPE_MESSAGES: Record<ReleaseType, () => string> = {
  major: m.release_notes_type_major,
  minor: m.release_notes_type_minor,
  patch: m.release_notes_type_patch,
};

export function releaseTypeLabel(type: ReleaseType): string {
  return RELEASE_TYPE_MESSAGES[type]();
}
