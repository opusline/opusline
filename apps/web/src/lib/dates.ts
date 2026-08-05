const monthYear = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
});

export function monthYearLabel(date: string): string {
  return monthYear.format(new Date(date));
}

const fullDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function fullDateLabel(date: string): string {
  return fullDate.format(new Date(date));
}
