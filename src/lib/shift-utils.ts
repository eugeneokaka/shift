const SHIFTS = ["Morning", "Night", "Off", "Off"] as const;
export type Shift = (typeof SHIFTS)[number];

const DEFAULT_BASE_DATE = new Date("2026-01-31");

/**
 * Calculate the shift for a given date based on a 4-day cycle.
 * @param date - The date to check
 * @param baseDate - The reference date (defaults to 2026-01-31)
 * @returns The shift type for that date
 */
export function getShiftForDate(
  date: Date,
  baseDate: Date = DEFAULT_BASE_DATE
): Shift {
  // Normalize both dates to midnight UTC to avoid timezone issues
  const normalizedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const normalizedBase = new Date(Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate()));
  
  const diffTime = normalizedDate.getTime() - normalizedBase.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const index = ((diffDays % SHIFTS.length) + SHIFTS.length) % SHIFTS.length;
  return SHIFTS[index];
}

/**
 * Get all days in a month with their shifts.
 * @param year - The year
 * @param month - The month (0-indexed, 0 = January)
 * @param baseDate - The reference date
 * @returns Array of objects with date and shift
 */
export function getMonthShifts(
  year: number,
  month: number,
  baseDate: Date = DEFAULT_BASE_DATE
): Array<{ date: Date; shift: Shift; dayOfWeek: number }> {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Array<{ date: Date; shift: Shift; dayOfWeek: number }> = [];

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const shift = getShiftForDate(date, baseDate);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    days.push({ date, shift, dayOfWeek });
  }

  return days;
}

/**
 * Organize days into weeks for calendar display.
 * Each week starts on Sunday.
 * @param year - The year
 * @param month - The month (0-indexed)
 * @param baseDate - The reference date
 * @returns Array of weeks, each containing day objects or null for empty cells
 */
export function getMonthWeeks(
  year: number,
  month: number,
  baseDate: Date = DEFAULT_BASE_DATE
): Array<Array<{ date: Date; shift: Shift } | null>> {
  const monthDays = getMonthShifts(year, month, baseDate);
  const weeks: Array<Array<{ date: Date; shift: Shift } | null>> = [];
  let currentWeek: Array<{ date: Date; shift: Shift } | null> = [];

  // Fill the first week with nulls until we reach the first day
  const firstDayOfWeek = monthDays[0].dayOfWeek;
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  // Add all days to weeks
  monthDays.forEach((day) => {
    currentWeek.push({ date: day.date, shift: day.shift });

    // If we've completed a week (7 days), start a new one
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Fill the last week with nulls if needed
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
