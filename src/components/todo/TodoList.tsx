"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useCalendarStore } from "@/stores/calendarStore";
import { TodoItem } from "./TodoItem";
import { TodoAdd } from "./TodoAdd";
import { parseDate, getWeekdayLabel } from "@/lib/date";
import { springs } from "@/lib/springs";
import { Doto } from "@/components/Doto";

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
  const allDone = dateTodos.length > 0 && completedTodos.length === dateTodos.length;

  return (
    <motion.div
      className={desktopMode ? "h-full flex flex-col" : "min-h-screen flex flex-col"}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
    >
      {/* Pink header */}
      <div className="gum-panel-header">
        <div className="flex items-center gap-3">
          {!desktopMode && (
            <button onClick={() => selectDate(null)} className="gum-btn w-8 h-8 text-sm font-bold ">←</button>
          )}
          {desktopMode && (
            <button onClick={() => selectDate(null)} className="gum-btn w-7 h-7 text-xs font-bold ">✕</button>
          )}
          <motion.div layoutId={desktopMode ? undefined : `day-${selectedDate}`}>
            <h1 className="text-[22px] font-black tracking-tight">
              {dayLabel}
              <span className="text-[13px] font-bold opacity-70 ml-2">{weekday}</span>
            </h1>
          </motion.div>
        </div>

        {/* Mini stats in header */}
        {dateTodos.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] font-bold opacity-80">
              {completedTodos.length}/{dateTodos.length} 완료
            </span>
            <div className="flex-1 h-1.5 bg-black/15 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: allDone ? "var(--color-success)" : "#000" }}
                initial={{ width: 0 }}
                animate={{ width: `${dateTodos.length === 0 ? 0 : (completedTodos.length / dateTodos.length) * 100}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
              />
            </div>
            {allDone && <Doto mood="celebrate" size={24} />}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">
        <div className="gum-card p-4">
          {dateTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Doto mood="sleep" size={72} />
              <p className="text-text-tertiary text-[14px] mt-3 font-bold">아직 할 일이 없어요</p>
            </div>
          ) : (
            <div>
              {incompleteTodos.map((todo, i) => (
                <motion.div key={todo.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03, type: "spring", ...springs.reorder }}>
                  <TodoItem todo={todo} date={selectedDate} category={categoryMap.get(todo.categoryId ?? "")} />
                </motion.div>
              ))}
              {completedTodos.length > 0 && (
                <>
                  <div className="flex items-center gap-2 my-3">
                    <div className="flex-1 h-[2px] bg-border-subtle" />
                    <span className="gum-card-pink px-3 py-0.5 text-[10px] font-black">완료 {completedTodos.length}</span>
                    <div className="flex-1 h-[2px] bg-border-subtle" />
                  </div>
                  {completedTodos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} date={selectedDate} category={categoryMap.get(todo.categoryId ?? "")} completed />
                  ))}
                </>
              )}
            </div>
          )}

          <TodoAdd date={selectedDate} />
        </div>
      </div>
    </motion.div>
  );
}
