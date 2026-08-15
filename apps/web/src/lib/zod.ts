import * as z from "zod/mini";

import type { UiLocale } from "@/lib/i18n";
import { m } from "@/paraglide/messages.js";
import { getLocale } from "@/paraglide/runtime.js";

export function applyZodLocale(tag: UiLocale): void {
  z.config({
    ...(tag === "fr" ? z.locales.fr() : z.locales.en()),
    customError: (issue) => {
      if (issue.code === "invalid_format" && issue.format === "email") {
        return m.zod_email_invalid();
      }

      if (issue.code === "too_small" && issue.origin === "string") {
        return issue.minimum === 1
          ? m.zod_field_required()
          : m.zod_too_small({ min: String(issue.minimum) });
      }

      if (issue.code === "too_big" && issue.origin === "string") {
        return m.zod_too_big({ max: String(issue.maximum) });
      }

      return undefined;
    },
  });
}

applyZodLocale(getLocale());
