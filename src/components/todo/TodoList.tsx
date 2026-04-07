"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useCalendarStore } from "@/stores/calendarStore";
import { TodoItem } from "./TodoItem";
import { TodoAdd } from "./TodoAdd";
import { parseDate, getWeekdayLabel } from "@/lib/date";
import { springs } from "@/lib/springs";

export function TodoList() {
  const selectedDate = useCalendarStore((s) => s.selectedDate);
  const selectDate = useCalendarStore((s) => s.selectDate);
  const todos = useCalendarStore((s) => s.todos);
  const completions = useCalendarStore((s) => s.completions);
  const categories = useCalendarStore((s) => s.categories);

  if (!selectedDate) return null;

  const date = parseDate(selectedDate);
  const dayLabel = `${date.getMonth() + 1}월 ${date.getDate()}일`;
  const weekday = getWeekdayLabel(date.getDay()) + "요일";

  // Filter todos for this date (reactive — re-runs when todos changes)
  const dow = date.getDay();
  const dateTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (todo.isRoutine && todo.routineDays) {
        if (!todo.routineDays.includes(dow)) return false;
        if (selectedDate < todo.startDate) return false;
        if (todo.routineEndDate && selectedDate > todo.routineEndDate) return false;
        return true;
      }
      if (todo.endDate) {
        return selectedDate >= todo.startDate && selectedDate <= todo.endDate;
      }
      return selectedDate === todo.startDate;
    });
  }, [todos, selectedDate, dow]);

  const completionSet = useMemo(
    () => new Set(completions.filter((c) => c.completedDate === selectedDate).map((c) => c.todoId)),
    [completions, selectedDate]
  );

  const incompleteTodos = dateTodos.filter((t) => !completionSet.has(t.id));
  const completedTodos = dateTodos.filter((t) => completionSet.has(t.id));

  return (
    <motion.div
      className="px-5 pt-12 pb-8 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <motion.button
          onClick={() => selectDate(null)}
          className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary"
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>
        <motion.div layoutId={`day-${selectedDate}`}>
          <h1 className="text-[22px] font-bold tracking-tight">
            {dayLabel}
            <span className="text-sm font-normal text-text-secondary ml-1.5">
              {weekday}
            </span>
          </h1>
        </motion.div>
      </div>

      {/* Todo Items */}
      {dateTodos.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-32">
          <p
            className="text-[15px] text-text-tertiary"
            style={{ animation: "breathe 3s ease-in-out infinite" }}
          >
            nothing here yet
          </p>
        </div>
      ) : (
        <div>
          {incompleteTodos.map((todo, i) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.05,
                type: "spring",
                ...springs.reorder,
              }}
            >
              <TodoItem
                todo={todo}
                date={selectedDate}
                category={categories.find((c) => c.id === todo.categoryId)}
              />
            </motion.div>
          ))}

          {completedTodos.length > 0 && (
            <>
              <div className="h-px bg-border-subtle my-3" />
              {completedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  date={selectedDate}
                  category={categories.find((c) => c.id === todo.categoryId)}
                  completed
                />
              ))}
            </>
          )}
        </div>
      )}

      <TodoAdd date={selectedDate} />
    </motion.div>
  );
}
