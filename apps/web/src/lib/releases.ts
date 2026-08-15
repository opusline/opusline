import { isReleaseUnread } from "./versions";

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
