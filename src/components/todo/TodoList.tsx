"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useCalendarStore } from "@/stores/calendarStore";
import { TodoItem } from "./TodoItem";
import { TodoAdd } from "./TodoAdd";
import { parseDate, getWeekdayLabel } from "@/lib/date";
import { springs } from "@/lib/springs";

interface TodoListProps { desktopMode?: boolean; }

export function TodoList({ desktopMode = false }: TodoListProps) {
  const selectedDate = useCalendarStore((s) => s.selectedDate);
  const selectDate = useCalendarStore((s) => s.selectDate);
  const todos = useCalendarStore((s) => s.todos);
  const completions = useCalendarStore((s) => s.completions);
  const categories = useCalendarStore((s) => s.categories);

  const dateTodos = useMemo(() => {
    if (!selectedDate) return [];
    const date = parseDate(selectedDate);
    const dow = date.getDay();
    return todos.filter((todo) => {
      if (todo.isRoutine && todo.routineDays) {
        if (!todo.routineDays.includes(dow)) return false;
        if (selectedDate < todo.startDate) return false;
        if (todo.routineEndDate && selectedDate > todo.routineEndDate) return false;
        return true;
      }
      if (todo.endDate) return selectedDate >= todo.startDate && selectedDate <= todo.endDate;
      return selectedDate === todo.startDate;
    });
  }, [todos, selectedDate]);

  const completionSet = useMemo(
    () => new Set(completions.filter((c) => c.completedDate === selectedDate).map((c) => c.todoId)),
    [completions, selectedDate]
  );
  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  if (!selectedDate) return null;

  const date = parseDate(selectedDate);
  const dayLabel = `${date.getMonth() + 1}월 ${date.getDate()}일`;
  const weekday = getWeekdayLabel(date.getDay()) + "요일";
  const incompleteTodos = dateTodos.filter((t) => !completionSet.has(t.id));
  const completedTodos = dateTodos.filter((t) => completionSet.has(t.id));

  return (
    <motion.div
      className={desktopMode ? "h-full flex flex-col" : "min-h-screen flex flex-col bg-bg-secondary"}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-border flex items-center gap-3">
        <button
          onClick={() => selectDate(null)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-bg-secondary transition-colors"
        >
          {desktopMode ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </button>
        <div className="flex-1">
          <h1 className="text-[17px] font-semibold tracking-tight">{dayLabel}</h1>
          <p className="text-[12px] text-text-tertiary">{weekday}</p>
        </div>
        {dateTodos.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-text-secondary">
              {completedTodos.length}/{dateTodos.length}
            </span>
            <div className="w-16 h-1.5 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${(completedTodos.length / dateTodos.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {dateTodos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-bg-secondary flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <p className="text-text-tertiary text-[14px]">할 일이 없습니다</p>
            <p className="text-text-tertiary text-[12px] mt-1">아래에서 추가해보세요</p>
          </div>
        ) : (
          <div className="space-y-1">
            {incompleteTodos.map((todo, i) => (
              <motion.div key={todo.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, type: "spring", ...springs.reorder }}>
                <TodoItem todo={todo} date={selectedDate} category={categoryMap.get(todo.categoryId ?? "")} />
              </motion.div>
            ))}
            {completedTodos.length > 0 && (
              <div className="pt-3 mt-3 border-t border-border-light">
                <p className="text-[11px] font-medium text-text-tertiary mb-2 px-1">완료됨 ({completedTodos.length})</p>
                {completedTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} date={selectedDate} category={categoryMap.get(todo.categoryId ?? "")} completed />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-4">
          <TodoAdd date={selectedDate} />
        </div>
      </div>
    </motion.div>
  );
}
