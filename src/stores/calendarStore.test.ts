import { describe, it, expect, beforeEach } from "vitest";
import { useCalendarStore } from "./calendarStore";

// For tests, we use direct setState to bypass async API calls
// This tests the store logic (getTodosForDate, isCompleted, getCompletionRate, navigation)
// API integration is tested in api.test.ts

function resetStore() {
  useCalendarStore.setState({
    currentYear: 2026,
    currentMonth: 3, // April
    selectedDate: null,
    categories: [
      { id: "cat-1", name: "개인", color: "#FF6B6B", sortOrder: 0 },
      { id: "cat-2", name: "업무", color: "#FFBE5C", sortOrder: 1 },
    ],
    todos: [],
    completions: [],
    isLoading: false,
  });
}

function addTodoDirectly(todo: Parameters<typeof useCalendarStore.setState>[0] extends object ? never : never) {
  // Helper: add todo directly to state (bypassing async API)
}

describe("calendarStore", () => {
  beforeEach(resetStore);

  describe("month navigation", () => {
    it("nextMonth: 일반 월 이동", () => {
      useCalendarStore.getState().nextMonth();
      expect(useCalendarStore.getState().currentMonth).toBe(4);
      expect(useCalendarStore.getState().currentYear).toBe(2026);
    });

    it("nextMonth: 12월 → 1월 연도 넘김", () => {
      useCalendarStore.setState({ currentMonth: 11 });
      useCalendarStore.getState().nextMonth();
      expect(useCalendarStore.getState().currentMonth).toBe(0);
      expect(useCalendarStore.getState().currentYear).toBe(2027);
    });

    it("prevMonth: 일반 월 이동", () => {
      useCalendarStore.getState().prevMonth();
      expect(useCalendarStore.getState().currentMonth).toBe(2);
      expect(useCalendarStore.getState().currentYear).toBe(2026);
    });

    it("prevMonth: 1월 → 12월 연도 넘김", () => {
      useCalendarStore.setState({ currentMonth: 0 });
      useCalendarStore.getState().prevMonth();
      expect(useCalendarStore.getState().currentMonth).toBe(11);
      expect(useCalendarStore.getState().currentYear).toBe(2025);
    });
  });

  describe("getTodosForDate", () => {
    it("single-day: 해당 날짜의 투두만 반환", () => {
      useCalendarStore.setState({
        todos: [
          { id: "todo-1", categoryId: null, title: "4월 7일", startDate: "2026-04-07", endDate: null, isRoutine: false, routineDays: null, routineEndDate: null, sortOrder: 0 },
          { id: "todo-2", categoryId: null, title: "4월 8일", startDate: "2026-04-08", endDate: null, isRoutine: false, routineDays: null, routineEndDate: null, sortOrder: 0 },
        ],
      });

      const result = useCalendarStore.getState().getTodosForDate("2026-04-07");
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("4월 7일");
    });

    it("multi-day: startDate~endDate 범위 내 날짜 포함", () => {
      useCalendarStore.setState({
        todos: [
          { id: "todo-1", categoryId: null, title: "3일간", startDate: "2026-04-05", endDate: "2026-04-07", isRoutine: false, routineDays: null, routineEndDate: null, sortOrder: 0 },
        ],
      });

      expect(useCalendarStore.getState().getTodosForDate("2026-04-04")).toHaveLength(0);
      expect(useCalendarStore.getState().getTodosForDate("2026-04-05")).toHaveLength(1);
      expect(useCalendarStore.getState().getTodosForDate("2026-04-06")).toHaveLength(1);
      expect(useCalendarStore.getState().getTodosForDate("2026-04-07")).toHaveLength(1);
      expect(useCalendarStore.getState().getTodosForDate("2026-04-08")).toHaveLength(0);
    });

    it("routine: 해당 요일에만 표시", () => {
      useCalendarStore.setState({
        todos: [
          { id: "todo-1", categoryId: null, title: "매주 화목", startDate: "2026-04-01", endDate: null, isRoutine: true, routineDays: [2, 4], routineEndDate: null, sortOrder: 0 },
        ],
      });

      expect(useCalendarStore.getState().getTodosForDate("2026-04-07")).toHaveLength(1); // Tue
      expect(useCalendarStore.getState().getTodosForDate("2026-04-08")).toHaveLength(0); // Wed
      expect(useCalendarStore.getState().getTodosForDate("2026-04-09")).toHaveLength(1); // Thu
    });

    it("routine: startDate 이전에는 표시 안 됨", () => {
      useCalendarStore.setState({
        todos: [
          { id: "todo-1", categoryId: null, title: "매주 화요일", startDate: "2026-04-07", endDate: null, isRoutine: true, routineDays: [2], routineEndDate: null, sortOrder: 0 },
        ],
      });

      expect(useCalendarStore.getState().getTodosForDate("2026-03-31")).toHaveLength(0);
      expect(useCalendarStore.getState().getTodosForDate("2026-04-07")).toHaveLength(1);
    });

    it("routine: routineEndDate 이후에는 표시 안 됨", () => {
      useCalendarStore.setState({
        todos: [
          { id: "todo-1", categoryId: null, title: "한달간 매주 화요일", startDate: "2026-04-01", endDate: null, isRoutine: true, routineDays: [2], routineEndDate: "2026-04-30", sortOrder: 0 },
        ],
      });

      expect(useCalendarStore.getState().getTodosForDate("2026-04-28")).toHaveLength(1);
      expect(useCalendarStore.getState().getTodosForDate("2026-05-05")).toHaveLength(0);
    });
  });

  describe("isCompleted", () => {
    it("완료된 투두는 true", () => {
      useCalendarStore.setState({
        todos: [{ id: "todo-1", categoryId: null, title: "테스트", startDate: "2026-04-07", endDate: null, isRoutine: false, routineDays: null, routineEndDate: null, sortOrder: 0 }],
        completions: [{ id: "comp-1", todoId: "todo-1", completedDate: "2026-04-07" }],
      });
      expect(useCalendarStore.getState().isCompleted("todo-1", "2026-04-07")).toBe(true);
    });

    it("미완료 투두는 false", () => {
      expect(useCalendarStore.getState().isCompleted("todo-1", "2026-04-07")).toBe(false);
    });
  });

  describe("getCompletionRate", () => {
    it("투두 없으면 -1 반환", () => {
      expect(useCalendarStore.getState().getCompletionRate("2026-04-07")).toBe(-1);
    });

    it("일부 완료 시 비율 반환", () => {
      useCalendarStore.setState({
        todos: [
          { id: "todo-1", categoryId: null, title: "하나", startDate: "2026-04-07", endDate: null, isRoutine: false, routineDays: null, routineEndDate: null, sortOrder: 0 },
          { id: "todo-2", categoryId: null, title: "둘", startDate: "2026-04-07", endDate: null, isRoutine: false, routineDays: null, routineEndDate: null, sortOrder: 0 },
        ],
        completions: [{ id: "comp-1", todoId: "todo-1", completedDate: "2026-04-07" }],
      });
      expect(useCalendarStore.getState().getCompletionRate("2026-04-07")).toBe(0.5);
    });

    it("전부 완료 시 1.0 반환", () => {
      useCalendarStore.setState({
        todos: [
          { id: "todo-1", categoryId: null, title: "하나", startDate: "2026-04-07", endDate: null, isRoutine: false, routineDays: null, routineEndDate: null, sortOrder: 0 },
        ],
        completions: [{ id: "comp-1", todoId: "todo-1", completedDate: "2026-04-07" }],
      });
      expect(useCalendarStore.getState().getCompletionRate("2026-04-07")).toBe(1);
    });
  });
});
