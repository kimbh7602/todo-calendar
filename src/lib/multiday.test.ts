import { describe, it, expect } from "vitest";
import { splitByWeek, assignSlots, type WeekSegment } from "./multiday";
import type { Todo } from "@/types";

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: "todo-1",
  categoryId: "cat-1",
  title: "멀티데이 테스트",
  startDate: "2026-04-06",
  endDate: "2026-04-08",
  isRoutine: false,
  routineDays: null,
  routineEndDate: null,
  sortOrder: 0,
  ...overrides,
});

describe("splitByWeek", () => {
  it("한 주 안에서 끝나는 멀티데이 투두", () => {
    // Apr 6 (Mon) ~ Apr 8 (Wed) — same week
    const segments = splitByWeek(makeTodo(), 2026, 3); // April 2026
    expect(segments).toHaveLength(1);
    expect(segments[0].startCol).toBe(1); // Monday = col 1
    expect(segments[0].span).toBe(3); // Mon, Tue, Wed
  });

  it("주 경계를 넘는 멀티데이 투두", () => {
    // Apr 10 (Fri) ~ Apr 14 (Tue) — crosses week boundary
    const todo = makeTodo({ startDate: "2026-04-10", endDate: "2026-04-14" });
    const segments = splitByWeek(todo, 2026, 3);
    expect(segments).toHaveLength(2);
    // First segment: Fri ~ Sat
    expect(segments[0].startCol).toBe(5); // Friday
    expect(segments[0].span).toBe(2); // Fri, Sat
    // Second segment: Sun ~ Tue
    expect(segments[1].startCol).toBe(0); // Sunday
    expect(segments[1].span).toBe(3); // Sun, Mon, Tue
  });

  it("월 경계를 넘는 멀티데이 투두 (현재 월 부분만)", () => {
    // Mar 30 (Mon) ~ Apr 2 (Thu)
    const todo = makeTodo({ startDate: "2026-03-30", endDate: "2026-04-02" });
    const segments = splitByWeek(todo, 2026, 3); // April view
    // Should show the part that falls in the April calendar grid
    expect(segments.length).toBeGreaterThanOrEqual(1);
  });
});

describe("assignSlots", () => {
  it("겹치지 않는 바는 slot 0에 할당", () => {
    const segments: WeekSegment[] = [
      { row: 1, startCol: 0, span: 2, todo: makeTodo({ id: "a" }) },
      { row: 1, startCol: 3, span: 2, todo: makeTodo({ id: "b" }) },
    ];
    const result = assignSlots(segments);
    expect(result[0].slot).toBe(0);
    expect(result[1].slot).toBe(0);
  });

  it("겹치는 바는 다른 slot에 할당", () => {
    const segments: WeekSegment[] = [
      { row: 1, startCol: 0, span: 3, todo: makeTodo({ id: "a" }) },
      { row: 1, startCol: 1, span: 3, todo: makeTodo({ id: "b" }) },
      { row: 1, startCol: 2, span: 3, todo: makeTodo({ id: "c" }) },
    ];
    const result = assignSlots(segments);
    expect(result[0].slot).toBe(0);
    expect(result[1].slot).toBe(1);
    expect(result[2].slot).toBe(2);
  });

  it("셀당 3개 초과 시 overflow 표시", () => {
    const segments: WeekSegment[] = [
      { row: 1, startCol: 0, span: 3, todo: makeTodo({ id: "a" }) },
      { row: 1, startCol: 0, span: 3, todo: makeTodo({ id: "b" }) },
      { row: 1, startCol: 0, span: 3, todo: makeTodo({ id: "c" }) },
      { row: 1, startCol: 0, span: 3, todo: makeTodo({ id: "d" }) },
    ];
    const result = assignSlots(segments);
    const visible = result.filter((s) => s.slot !== -1);
    const overflow = result.filter((s) => s.slot === -1);
    expect(visible).toHaveLength(3);
    expect(overflow).toHaveLength(1);
  });
});
