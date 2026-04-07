export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

export function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days: Date[] = [];

  // Fill leading days from previous month
  const startDow = firstDay.getDay(); // 0=Sun
  for (let i = startDow - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  // Current month days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  // Fill trailing days to complete grid (6 rows x 7 cols = 42)
  while (days.length < 42) {
    const next = days.length - startDow - lastDay.getDate() + 1;
    days.push(new Date(year, month + 1, next));
  }

  // If we only need 5 rows (35 cells) and last row is entirely next month, trim
  if (days.length > 35) {
    const row6Start = days[35];
    if (row6Start.getMonth() !== month) {
      days.splice(35);
    }
  }

  return days;
}

export function getWeekdayLabel(dow: number): string {
  return ["일", "월", "화", "수", "목", "금", "토"][dow];
}

export function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function getDaysBetween(start: string, end: string): string[] {
  const dates: string[] = [];
  const current = parseDate(start);
  const endDate = parseDate(end);

  while (current <= endDate) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
