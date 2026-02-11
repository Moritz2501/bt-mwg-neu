export function minutesBetween(start: Date, end: Date) {
  const diffMs = end.getTime() - start.getTime();
  return Math.max(0, Math.round(diffMs / 60000));
}
