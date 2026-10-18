import type { DocumentLanguage } from "@opusline/api-client";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";

import { m } from "@/paraglide/messages.js";

const LANGUAGES: readonly {
  value: DocumentLanguage;
  token: string;
  label: () => string;
}[] = [
  { value: 0, token: "fr", label: m.invoicing_language_french },
  { value: 1, token: "en", label: m.invoicing_language_english },
];

/** Which language the sheet beside it is printed in. */
export function DocumentLanguageToggle({
  value,
  onChange,
}: {
  value: DocumentLanguage;
  onChange: (language: DocumentLanguage) => void;
}) {
  return (
    <SegmentedControl
      aria-label={m.invoicing_document_language()}
      onValueChange={(next) => {
        const chosen = LANGUAGES.find(
          (language) => String(language.value) === next[0],
        );

        if (chosen !== undefined) {
          onChange(chosen.value);
        }
      }}
      size="sm"
      value={[String(value)]}
    >
      {LANGUAGES.map((language) => (
        <SegmentedControlItem
          data-language={language.token}
          data-testid="document-language"
          key={language.value}
          value={String(language.value)}
        >
          {language.label()}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  );
}
