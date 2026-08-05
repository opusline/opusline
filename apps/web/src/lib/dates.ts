const monthYear = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
});

export function monthYearLabel(date: string): string {
  return monthYear.format(new Date(date));
}
