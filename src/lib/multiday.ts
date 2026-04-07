import type { Todo } from "@/types";
import { getMonthDays, formatDate } from "./date";

export interface WeekSegment {
  row: number; // which week row (0-based)
  startCol: number; // 0=Sun..6=Sat
  span: number; // how many columns
  todo: Todo;
}

export interface SlottedSegment extends WeekSegment {
  slot: number; // 0, 1, 2 = visible slots. -1 = overflow
  color?: string; // category color for rendering
}

/**
 * Split a multi-day todo into per-week segments within a calendar month grid.
 */
export function splitByWeek(
  todo: Todo,
  year: number,
  month: number
): WeekSegment[] {
  if (!todo.endDate) return [];

  const days = getMonthDays(year, month);
  const gridStart = formatDate(days[0]);
  const gridEnd = formatDate(days[days.length - 1]);

  // Clamp todo range to the visible grid
  const todoStart = todo.startDate < gridStart ? gridStart : todo.startDate;
  const todoEnd = todo.endDate > gridEnd ? gridEnd : todo.endDate;

  if (todoStart > todoEnd) return [];

  const segments: WeekSegment[] = [];

  // Walk through the grid week by week
  const numWeeks = Math.ceil(days.length / 7);

  for (let week = 0; week < numWeeks; week++) {
    const weekStartIdx = week * 7;
    const weekEndIdx = weekStartIdx + 6;
    const weekStartDate = formatDate(days[weekStartIdx]);
    const weekEndDate = formatDate(days[Math.min(weekEndIdx, days.length - 1)]);

    // Does this todo overlap with this week?
    if (todoStart > weekEndDate || todoEnd < weekStartDate) continue;

    // Clamp to this week
    const segStart = todoStart > weekStartDate ? todoStart : weekStartDate;
    const segEnd = todoEnd < weekEndDate ? todoEnd : weekEndDate;

    // Find column positions
    const startCol = days
      .slice(weekStartIdx, weekStartIdx + 7)
      .findIndex((d) => formatDate(d) === segStart);
    const endCol = days
      .slice(weekStartIdx, weekStartIdx + 7)
      .findIndex((d) => formatDate(d) === segEnd);

    if (startCol === -1 || endCol === -1) continue;

    segments.push({
      row: week,
      startCol,
      span: endCol - startCol + 1,
      todo,
    });
  }

  return segments;
}

/**
 * Assign visual slots (0, 1, 2) to segments within each week row.
 * Returns -1 for overflow segments (more than 3 per cell).
 */
export function assignSlots(segments: WeekSegment[]): SlottedSegment[] {
  const MAX_SLOTS = 3;

  // Group by row
  const byRow = new Map<number, WeekSegment[]>();
  for (const seg of segments) {
    const list = byRow.get(seg.row) || [];
    list.push(seg);
    byRow.set(seg.row, list);
  }

  const result: SlottedSegment[] = [];

  for (const [, rowSegments] of byRow) {
    // Track which slots are occupied at each column
    // slotOccupied[col][slot] = true if occupied
    const slotOccupied: boolean[][] = Array.from({ length: 7 }, () =>
      Array(MAX_SLOTS).fill(false)
    );

    for (const seg of rowSegments) {
      // Find the lowest slot that's free across all columns this segment spans
      let assigned = -1;
      for (let slot = 0; slot < MAX_SLOTS; slot++) {
        let free = true;
        for (let col = seg.startCol; col < seg.startCol + seg.span; col++) {
          if (col < 7 && slotOccupied[col][slot]) {
            free = false;
            break;
          }
        }
        if (free) {
          assigned = slot;
          // Mark occupied
          for (let col = seg.startCol; col < seg.startCol + seg.span; col++) {
            if (col < 7) slotOccupied[col][slot] = true;
          }
          break;
        }
      }

      result.push({ ...seg, slot: assigned });
    }
  }

  return result;
}

/**
 * Get overflow counts per cell (how many bars are hidden).
 */
export function getOverflowCounts(
  slotted: SlottedSegment[]
): Map<string, number> {
  const overflow = new Map<string, number>();
  for (const seg of slotted) {
    if (seg.slot === -1) {
      for (let col = seg.startCol; col < seg.startCol + seg.span; col++) {
        const key = `${seg.row}-${col}`;
        overflow.set(key, (overflow.get(key) || 0) + 1);
      }
    }
  }
  return overflow;
}
