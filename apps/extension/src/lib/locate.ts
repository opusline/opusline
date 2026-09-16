const FILLABLE_TYPES = new Set(["text", "number", "tel", "search"]);

export function isFillableInput(
  element: Element | null,
): element is HTMLInputElement {
  return (
    element instanceof HTMLInputElement &&
    FILLABLE_TYPES.has(element.type.toLowerCase())
  );
}

/** The first fillable input under any of the selectors, in order. */
export function locateBySelectors(
  doc: Document,
  selectors: readonly string[],
): HTMLInputElement | null {
  for (const selector of selectors) {
    const element = doc.querySelector(selector);
    if (isFillableInput(element)) {
      return element;
    }
  }

  return null;
}

/**
 * The input a `<label>` matching the pattern points at, through `for`, an
 * input nested in the label, or `aria-labelledby` back-references. Ids and
 * names are what portals rename first; visible wording lasts longer.
 */
export function locateByLabel(
  doc: Document,
  pattern: RegExp,
): HTMLInputElement | null {
  for (const label of doc.querySelectorAll("label")) {
    if (!pattern.test(normalizeText(label.textContent))) {
      continue;
    }
    const target = labelledInput(doc, label);
    if (target !== null) {
      return target;
    }
  }

  for (const input of doc.querySelectorAll("input[aria-label]")) {
    if (
      isFillableInput(input) &&
      pattern.test(normalizeText(input.getAttribute("aria-label")))
    ) {
      return input;
    }
  }

  return null;
}

/**
 * Forms laid out as tables carry the line code in the first cell and the
 * input further along the same row, with no `<label>` at all.
 */
export function locateInRow(
  doc: Document,
  pattern: RegExp,
): HTMLInputElement | null {
  for (const row of doc.querySelectorAll("tr")) {
    const heading = row.querySelector("th, td");
    if (heading === null || !pattern.test(normalizeText(heading.textContent))) {
      continue;
    }
    for (const input of row.querySelectorAll("input")) {
      if (isFillableInput(input)) {
        return input;
      }
    }
  }

  return null;
}

/** The fillable input that follows `first` in the same table row, if any. */
export function nextInputInRow(
  first: HTMLInputElement,
): HTMLInputElement | null {
  const row = first.closest("tr");
  if (row === null) {
    return null;
  }
  let seenFirst = false;
  for (const input of row.querySelectorAll("input")) {
    if (input === first) {
      seenFirst = true;
      continue;
    }
    if (seenFirst && isFillableInput(input)) {
      return input;
    }
  }

  return null;
}

function labelledInput(
  doc: Document,
  label: HTMLLabelElement,
): HTMLInputElement | null {
  const forId = label.getAttribute("for");
  if (forId !== null) {
    const byId = doc.getElementById(forId);
    if (isFillableInput(byId)) {
      return byId;
    }
  }
  const nested = label.querySelector("input");
  if (isFillableInput(nested)) {
    return nested;
  }
  if (label.id !== "") {
    const byAria = doc.querySelector(`input[aria-labelledby~="${label.id}"]`);
    if (isFillableInput(byAria)) {
      return byAria;
    }
  }

  return null;
}

function normalizeText(text: string | null): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}
