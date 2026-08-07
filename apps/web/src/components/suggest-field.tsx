import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { cn } from "@opusline/ui/lib/utils";
import { useEffect, useId, useRef, useState } from "react";

import type { StringFieldApi } from "@/components/form-text-field";

export type Suggestion = { id: string; label: string };

const DEBOUNCE_MS = 250;

type SuggestFieldProps<T extends Suggestion> = {
  field: StringFieldApi;
  label: string;
  labelClassName?: string;
  placeholder?: string;
  onSearch: (query: string, signal: AbortSignal) => Promise<T[]>;
  onSelect: (suggestion: T) => void;
};

export function SuggestField<T extends Suggestion>({
  field,
  label,
  labelClassName,
  placeholder,
  onSearch,
  onSelect,
}: SuggestFieldProps<T>) {
  const listId = useId();
  const errorId = `${field.name}-error`;
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [highlighted, setHighlighted] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [hasLookupFailed, setHasLookupFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inFlight = useRef<AbortController>(undefined);
  const isInvalid = !field.state.meta.isValid;

  const cancelPendingSearch = () => {
    clearTimeout(timer.current);
    inFlight.current?.abort();
  };

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      inFlight.current?.abort();
    },
    [],
  );

  const searchAfterTyping = (query: string) => {
    cancelPendingSearch();

    const controller = new AbortController();
    inFlight.current = controller;

    timer.current = setTimeout(() => {
      void onSearch(query, controller.signal)
        .then((found) => {
          // A slower earlier lookup must not overwrite a newer one, and an
          // aborted one must not close a list the user is already reading.
          if (inFlight.current !== controller || controller.signal.aborted) {
            return;
          }

          setSuggestions(found);
          setHighlighted(-1);
          setIsOpen(found.length > 0);
          setHasLookupFailed(false);
        })
        .catch(() => {
          // Aborts are how a newer keystroke cancels this one, not a failure.
          if (inFlight.current !== controller || controller.signal.aborted) {
            return;
          }

          setSuggestions([]);
          setIsOpen(false);
          setHasLookupFailed(true);
        });
    }, DEBOUNCE_MS);
  };

  const apply = (suggestion: T) => {
    cancelPendingSearch();
    onSelect(suggestion);
    setSuggestions([]);
    setIsOpen(false);
    setHighlighted(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;

      setHighlighted((current) => {
        const next = current + step;

        if (next < 0) {
          return suggestions.length - 1;
        }

        return next >= suggestions.length ? 0 : next;
      });

      return;
    }

    if (event.key === "Enter" && highlighted >= 0) {
      const chosen = suggestions[highlighted];

      if (chosen !== undefined) {
        event.preventDefault();
        apply(chosen);
      }

      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setHighlighted(-1);
    }
  };

  return (
    <Field className="relative" data-invalid={isInvalid}>
      <FieldLabel className={labelClassName} htmlFor={field.name}>
        {label}
      </FieldLabel>
      <Input
        aria-activedescendant={
          highlighted >= 0 ? `${listId}-${highlighted}` : undefined
        }
        aria-autocomplete="list"
        aria-controls={isOpen ? listId : undefined}
        aria-describedby={isInvalid ? errorId : undefined}
        aria-expanded={isOpen}
        aria-invalid={isInvalid}
        autoComplete="off"
        id={field.name}
        onBlur={() => {
          field.handleBlur();
          setIsOpen(false);
        }}
        onChange={(event) => {
          field.handleChange(event.target.value);
          searchAfterTyping(event.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        role="combobox"
        value={field.state.value}
      />
      {isOpen && suggestions.length > 0 && (
        <div
          className="absolute top-full right-0 left-0 z-10 mt-1 overflow-hidden rounded-md border bg-card shadow-md"
          id={listId}
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <div
              aria-selected={index === highlighted}
              className={cn(
                "cursor-pointer px-3 py-2 text-foreground-2 text-sm",
                index === highlighted && "bg-accent text-foreground-hi",
              )}
              id={`${listId}-${index}`}
              key={suggestion.id}
              onMouseDown={(event) => {
                event.preventDefault();
                apply(suggestion);
              }}
              onMouseEnter={() => setHighlighted(index)}
              role="option"
              tabIndex={-1}
            >
              {suggestion.label}
            </div>
          ))}
        </div>
      )}
      {hasLookupFailed && !isInvalid ? (
        <span className="text-muted-foreground-3 text-xs" role="status">
          Suggestions indisponibles — saisissez l'adresse manuellement.
        </span>
      ) : null}
      {isInvalid ? (
        <FieldError errors={field.state.meta.errors} id={errorId} />
      ) : null}
    </Field>
  );
}
