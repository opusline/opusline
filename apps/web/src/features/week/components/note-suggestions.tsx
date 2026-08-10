import { ClockIcon } from "lucide-react";

const MAX_SUGGESTIONS = 3;

export function matchingNotes(notes: string[], typed: string): string[] {
  const query = typed.trim().toLowerCase();

  return notes
    .filter(
      (note) => note !== typed.trim() && note.toLowerCase().includes(query),
    )
    .slice(0, MAX_SUGGESTIONS);
}

type NoteSuggestionsProps = {
  suggestions: string[];
  onPick: (note: string) => void;
  keepFocus?: boolean;
};

export function NoteSuggestions({
  suggestions,
  onPick,
  keepFocus = false,
}: NoteSuggestionsProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-col">
      {suggestions.map((suggestion) => (
        <li key={suggestion}>
          <button
            className="flex w-full items-center gap-2 rounded-sm px-1.5 py-1.5 text-left text-muted-foreground text-sm hover:bg-accent hover:text-foreground-hi"
            onClick={() => onPick(suggestion)}
            onMouseDown={
              keepFocus ? (event) => event.preventDefault() : undefined
            }
            type="button"
          >
            <ClockIcon aria-hidden className="size-3 shrink-0 opacity-60" />
            <span className="truncate">{suggestion}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
