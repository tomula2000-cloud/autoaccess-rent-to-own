/**
 * Working-hours utilities for Auto Access automation.
 *
 * Business hours: Monday-Friday, 08:30-18:00 South African time (SAST, UTC+2).
 * SAST has no daylight saving, so it is always UTC+2.
 *
 * These helpers calculate how much *working time* has elapsed between two
 * instants, so automated status transitions only count time during business
 * hours (evenings and weekends are skipped).
 */

const SAST_OFFSET_MS = 2 * 60 * 60 * 1000; // UTC+2, no DST
const WORK_START_MIN = 8 * 60 + 30; // 08:30 => 510 minutes from midnight
const WORK_END_MIN = 18 * 60; // 18:00 => 1080 minutes from midnight

// Convert a real Date (UTC internally) to the equivalent "wall clock" Date in SAST.
function toSast(date: Date): Date {
  return new Date(date.getTime() + SAST_OFFSET_MS);
}

// Day of week in SAST: 0 = Sunday, 1 = Monday, ... 6 = Saturday
function sastDay(date: Date): number {
  return toSast(date).getUTCDay();
}

// Minutes from midnight in SAST
function sastMinutesOfDay(date: Date): number {
  const s = toSast(date);
  return s.getUTCHours() * 60 + s.getUTCMinutes();
}

function isWeekend(date: Date): boolean {
  const d = sastDay(date);
  return d === 0 || d === 6; // Sunday or Saturday
}

/**
 * Is the given instant within working hours?
 * (Mon-Fri, between 08:30 and 18:00 SAST)
 */
export function isWithinWorkingHours(date: Date = new Date()): boolean {
  if (isWeekend(date)) return false;
  const mins = sastMinutesOfDay(date);
  return mins >= WORK_START_MIN && mins < WORK_END_MIN;
}

/**
 * Calculate how many working MINUTES have elapsed between `start` and `end`,
 * counting only Mon-Fri 08:30-18:00 SAST.
 *
 * Walks the interval in small steps; robust and easy to reason about.
 * Step = 5 minutes (fine granularity; cron runs every 15 min anyway).
 */
export function workingMinutesBetween(start: Date, end: Date): number {
  if (end <= start) return 0;

  const STEP_MS = 5 * 60 * 1000; // 5-minute steps
  let workingMs = 0;
  let cursor = start.getTime();
  const endMs = end.getTime();

  while (cursor < endMs) {
    const sliceEnd = Math.min(cursor + STEP_MS, endMs);
    const sliceMid = new Date((cursor + sliceEnd) / 2);
    if (isWithinWorkingHours(sliceMid)) {
      workingMs += sliceEnd - cursor;
    }
    cursor = sliceEnd;
  }

  return workingMs / (60 * 1000);
}

/**
 * Convenience: have at least `minutes` working-minutes elapsed since `start`?
 */
export function workingMinutesElapsedAtLeast(
  start: Date,
  minutes: number,
  now: Date = new Date()
): boolean {
  return workingMinutesBetween(start, now) >= minutes;
}
