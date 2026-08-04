export function initials(name: string): string {
  const derived = name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return derived === "" ? "?" : derived;
}
