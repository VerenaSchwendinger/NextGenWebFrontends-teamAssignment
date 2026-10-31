// Shared date label, e.g. "Di., 15. September"
const dayFormatter = new Intl.DateTimeFormat('de-AT', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

export function formatDay(day: string): string {
  return dayFormatter.format(new Date(day))
}