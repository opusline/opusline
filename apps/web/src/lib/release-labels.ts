import { m } from "@/paraglide/messages.js";

import type { ReleaseItemKind } from "./releases";
import type { ReleaseType } from "./versions";

const RELEASE_KIND_MESSAGES: Record<ReleaseItemKind, () => string> = {
  new: m.release_notes_kind_new,
  improved: m.release_notes_kind_improved,
  fixed: m.release_notes_kind_fixed,
};

export function releaseKindLabel(kind: ReleaseItemKind): string {
  return RELEASE_KIND_MESSAGES[kind]();
}

/**
 * Kind colors follow the design's accents: new carries the brand, fixed the
 * success green, improved stays neutral.
 */
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
