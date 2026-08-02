import * as z from "zod/mini";

z.config({
  ...z.locales.fr(),
  customError: (issue) => {
    if (issue.code === "invalid_format" && issue.format === "email") {
      return "Adresse e-mail invalide.";
    }

    if (issue.code === "too_small" && issue.origin === "string") {
      return issue.minimum === 1
        ? "Ce champ est requis."
        : `Au moins ${issue.minimum} caractères.`;
    }

    if (issue.code === "too_big" && issue.origin === "string") {
      return `Au maximum ${issue.maximum} caractères.`;
    }

    return undefined;
  },
});
